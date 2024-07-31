/// <reference path="./.sst/platform/config.d.ts" />

// TODO - update to your aws profile from `~/.aws/credentials`
const AWS_CLI_PROFILE = undefined;

export default $config({
  app(input) {
    return {
      name: "sst-vector-types-repro",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: AWS_CLI_PROFILE,
        },
      },
    };
  },
  async run() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    const vector = new sst.aws.Vector("Vector", {
      dimension: 1536,
    });

    const seeder = new sst.aws.Function("Seeder", {
      handler: "index.seeder",
      link: [vector],
      url: true,
      environment: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      },
    });

    const app = new sst.aws.Function("MyApp", {
      handler: "index.app",
      link: [vector],
      url: true,
      environment: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      },
    });

    return {
      seeder: seeder.url,
      app: app.url,
    };
  },
});
