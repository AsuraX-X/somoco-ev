import { defineField, defineType } from "sanity";

export const partner = defineType({
  name: "partner",
  title: "Asset Finance Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "disabled",
      title: "Disabled",
      type: "boolean",
      description:
        "If enabled, this partner will not appear in public listings",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
      disabled: "disabled",
    },
    prepare({ title, media, disabled }) {
      return {
        title: disabled ? `${title} (Disabled)` : title,
        media,
      };
    },
  },
});
