import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.VERCEL_GIT_COMMIT_REF || "2024-codegrid-tinacms-4";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "/assets",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "_posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
            isTitle: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
          },
          {
            type: "image",
            name: "coverImage",
            label: "CoverImage",
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "object",
            name: "author",
            label: "Author",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "image",
                name: "picture",
                label: "Picture",
                required: true,
              },
            ],
          },
          {
            type: "object",
            name: "ogImage",
            label: "OG Image",
            fields: [
              {
                type: "image",
                name: "url",
                label: "URL",
                required: true,
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/posts/${document._sys.filename}`,
        },
      },
    ],
  },
});
