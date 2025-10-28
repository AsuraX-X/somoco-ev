import { type SchemaTypeDefinition } from "sanity";
import { vehicle } from "./vehicle";
import { adminCredentials } from "./adminCredentials";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [vehicle, adminCredentials],
};
