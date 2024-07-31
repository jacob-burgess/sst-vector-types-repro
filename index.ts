import OpenAI from "openai";
import { VectorClient } from "sst";

const vectorClient = VectorClient("Vector");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbedding(input: string) {
  const vector = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    encoding_format: "float",
    input,
  });

  return vector.data[0].embedding;
}

export async function seeder() {
  const randomSeedEmbeddings = [
    "the fat cat is laying in the sun on the grass",
    "a large boat is stuck deep in the water",
    "The Minnesota Vikings are playing football in the stadium",
    "A group of people are playing soccer on the field",
    "A man is riding a bicycle down the street",
    "A woman is sitting on a bench reading a book",
    "A dog is running through the grass",
    "A cat is sitting on a chair",
    "A bird is flying over the water",
    "A person is standing on a rock overlooking the ocean",
    "A person is sitting on a bench reading a book",
    "A person is standing on a rock overlooking the ocean",
    "A person is sitting on a bench reading a book",
  ];

  console.log("Removing all vectors...");

  await vectorClient.remove({
    include: {
      type: "sentence",
    },
  });

  for (const input of randomSeedEmbeddings) {
    const vector = await generateEmbedding(input);

    await vectorClient.put({
      vector,
      metadata: {
        type: "sentence",
        sentence: input,
      },
    });
  }

  return {
    statusCode: 200,
    body: {
      message: "Vectors seeded successfully",
      vectors: randomSeedEmbeddings,
    },
  };
}

export async function app() {
  const input = "who knew Dax had cats?";
  const vector = await generateEmbedding(input);

  const response = await vectorClient.query({
    vector,
    include: {
      type: "sentence",
    },
    count: 2,
  });
  // the type-hinted response type: { metadata: Record<string, any>, score: number }
  // the actual response type: { results: [ { metadata: Record<string, any>, score: number } ] }

  // Incorrectly type errors when trying to get results
  // @ts-ignore
  const responseSentences = response.results.map(
    (result) => result.metadata.sentence
  );

  return {
    statusCode: 200,
    body: {
      _message: "Vector query successful",
      _inputSentence: input,
      rawResponse: {
        description: "this is the response from VectorClient.query",
        data: response,
      },
      effedUpType: {
        description:
          "This is the return type of VectorClient.query (i.e. QueryResponse). Missing the `results` key, containing list of QueryResponse objects",
        data: "https://github.com/sst/ion/blob/c5da7f1cd48a3ba5b1231756d9f650a290081577/sdk/js/src/vector/index.ts#L170",
      },
    },
  };
}
