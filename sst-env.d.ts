/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    MyApp: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
    Seeder: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
    Vector: {
      putFunction: string
      queryFunction: string
      removeFunction: string
      type: "sst.aws.Vector"
    }
  }
}
export {}
