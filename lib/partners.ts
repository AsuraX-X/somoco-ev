import { client } from "@/sanity/lib/client";

export interface Partner {
  _id: string;
  name: string;
  logo: {
    asset: {
      _ref: string;
    };
  };
  email: string;
  disabled: boolean;
}

export async function getPartners(): Promise<Partner[]> {
  return client.fetch(
    `*[_type == "partner" && disabled != true] | order(name asc)`
  );
}
