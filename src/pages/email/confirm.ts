import { createStorefrontApiClient } from "@shopify/storefront-api-client";
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
// const { data, errors } = await shopify.request(createCustomerMutation, {
//   variables: {
//     input: {
//       email: emailToAdd,
//       password: "password",
//       acceptsMarketing: true,
//     },
//   },
// });
// console.log(data, errors);
