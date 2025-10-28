import { defineField, defineType } from "sanity";

export const adminCredentials = defineType({
  name: "adminCredentials",
  title: "Admin Credentials",
  type: "document",
  fields: [
    defineField({
      name: "passwordHash",
      title: "Password Hash",
      type: "string",
      description: "Bcrypt hash of the admin password (raw string)",
    }),
    defineField({
      name: "passwordHashB64",
      title: "Password Hash (Base64)",
      type: "string",
      description: "Base64 representation of the bcrypt hash",
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "_id",
      subtitle: "updatedAt",
    },
  },
});
