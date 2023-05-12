import { createClient } from "next-sanity";
// import { createClient } from "@sanity/client";
import { definePreview } from "next-sanity/preview";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import createImageUrlBuilder from "@sanity/image-url";

const config = {
  projectId: "0p4qfkaf",
  dataset: "production",
  apiVersion: "2021-03-25",
  useCdn: false,
};

export const sanityClient = createClient(config);

export const usePreviewSubscription = definePreview(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

export const PortableText = (props) => (
  <PortableTextComponent
    components={{ ...config, serializers: {} }}
    {...props}
  />
);
