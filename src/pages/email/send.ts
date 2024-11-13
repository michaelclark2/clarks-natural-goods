import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import type { APIRoute } from "astro";

const shopify = createStorefrontApiClient({
  storeDomain: "https://shop.clarksnaturalgoods.com",
  apiVersion: "2024-10",
  publicAccessToken: "4fd761a2fa1fc83cbc8a45c930c18a75",
});

const createCustomerMutation = `
mutation createCustomer($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      email
      acceptsMarketing
    }
  }
}
`;

export const POST: APIRoute = async ({ request }: { request: Request }) => {
  const data = await request.formData();

  const emailToAdd = data.get("email");

  if (!emailToAdd) {
    return new Response(null, {
      status: 400,
    });
  }

  // create unique ID for email
  const emailEncoded = btoa(emailToAdd!.toString());
  console.log({ emailEncoded });

  // add ID:email key to Redis
  const hsetResponse = await fetch(
    import.meta.env.KV_REST_API_URL +
      "/hset/" +
      emailEncoded +
      "/email/" +
      emailToAdd,
    {
      headers: {
        Authorization: "Bearer " + import.meta.env.KV_REST_API_TOKEN,
      },
    }
  ).then((r) => r.json());

  const expireResponse = await fetch(
    import.meta.env.KV_REST_API_URL + "/expire/" + emailEncoded + "/259200/",
    {
      headers: {
        Authorization: "Bearer " + import.meta.env.KV_REST_API_TOKEN,
      },
    }
  ).then((r) => r.json());

  // create email template, add link to confirmation page with ID
  // send email confirmation to email

  const userAdded = hsetResponse.result === 1 && expireResponse.result === 1;

  if (userAdded) {
    const { data, errors } = await shopify.request(createCustomerMutation, {
      variables: {
        input: {
          email: emailToAdd,
          password: "password",
          acceptsMarketing: true,
        },
      },
    });
    console.log(data, errors);
  } else {
    return new Response(null, { status: 400 });
  }

  return new Response(null, {
    status: 204,
  });
};
