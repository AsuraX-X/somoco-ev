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
      name: "exteriorImages",
      title: "Exterior Images",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "interiorImages",
      title: "Interior Images",
      type: "array",
      of: [{ type: "image" }],
    }),
    // Single document (PDF) such as a spec sheet or brochure
    defineField({
      name: "document",
      title: "Document",
      type: "file",
      options: { accept: "application/pdf" },
      fields: [
        defineField({ name: "title", type: "string", title: "Title" }),
        defineField({
          name: "description",
          type: "text",
          title: "Description",
        }),
      ],
    }),
    defineField({
      name: "description",
      type: "string",
    }),
    defineField({
      name: "disabled",
      title: "Disabled",
      type: "boolean",
      description:
        "If enabled, this vehicle will not appear in public listings",
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
  preview: {
    select: {
      title: "name",
      brand: "brand",
      media: "exteriorImages.0",
      disabled: "disabled",
    },
    prepare({ title, brand, media, disabled }) {
      return {
        title: disabled ? `${brand} ${title} (Disabled)` : `${brand} ${title}`,
        media,
      };
    },
  },
});
