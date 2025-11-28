import { type SchemaTypeDefinition } from "sanity";
import { vehicle } from "./vehicle";
import { partner } from "./partner";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [vehicle, partner],
};
