import { defineField, defineType, defineArrayMember } from "sanity";

// Reusable parameter object type
const parameterType = {
  type: "object" as const,
  fields: [
    defineField({
      name: "name",
      title: "Parameter Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "value",
    },
  },
};

export const vehicle = defineType({
  name: "event",
  title: "Vehicle",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      type: "string",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "description",
      type: "string",
    }),

    // Specifications Section
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "object",
      fields: [
        defineField({
          name: "keyParameters",
          title: "Key Parameters",
          type: "array",
          of: [defineArrayMember(parameterType)],
        }),
        defineField({
          name: "bodyParameters",
          title: "Body Parameters",
          type: "array",
          of: [defineArrayMember(parameterType)],
        }),
        defineField({
          name: "engineParameters",
          title: "Engine Parameters",
          type: "array",
          of: [defineArrayMember(parameterType)],
        }),
        defineField({
          name: "motorParameters",
          title: "Motor Parameters",
          type: "array",
          of: [defineArrayMember(parameterType)],
        }),
        defineField({
          name: "wheelBrakeParameters",
          title: "Wheel Brake Parameters",
          type: "array",
          of: [defineArrayMember(parameterType)],
        }),
        defineField({
          name: "keyConfigurations",
          title: "Key Configurations",
          type: "array",
          of: [defineArrayMember(parameterType)],
        }),
      ],
    }),
  ],
});
