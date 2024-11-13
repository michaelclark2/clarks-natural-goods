import type { APIRoute } from "astro";
import sendGrid from "@sendgrid/mail";
sendGrid.setApiKey(import.meta.env.SENDGRID_API_KEY);

import createConfirmationEmail from "../../assets/emails/newsletter-confirmation";

export const POST: APIRoute = async ({ request }: { request: Request }) => {
  const data = await request.json();

  const emailToAdd = data.email;

  if (!emailToAdd) {
    return new Response(null, {
      status: 400,
    });
  }

  // create unique ID for email
  const emailEncoded = btoa(emailToAdd.toString());

  // add ID:email key to Redis
  const addEmailTransactionResponses: { result: number }[] = await fetch(
    import.meta.env.KV_REST_API_URL + "/multi-exec",
    {
      body: `[
        ["HSET", "${emailEncoded}", "email", "${emailToAdd}"],
        ["EXPIRE", "${emailEncoded}", "259200"]
      ]`,
      headers: {
        Authorization: "Bearer " + import.meta.env.KV_REST_API_TOKEN,
      },
      method: "POST",
    }
  ).then((r) => r.json());

  const shouldSendEmail = addEmailTransactionResponses.every(
    (response) => response.result === 1
  );

  if (shouldSendEmail) {
    // create email template, add link to confirmation page with ID
    const confirmUrl =
      "https://clarksnaturalgoods.com/email/confirm?id=" +
      encodeURI(emailEncoded);
    const emailHTML = createConfirmationEmail({ confirmUrl });

    // send email confirmation to email
    const message = {
      to: emailToAdd,
      from: "michael@clarksnaturalgoods.com",
      subject:
        "Hello from Clark's Natural Goods! Please confirm your email address",
      html: `<a href="${confirmUrl}">Confirm your email address</a>`,
    };

    sendGrid
      .send(message)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
      })
      .catch(console.error);
  } else {
    return new Response(null, { status: 400 });
  }
  return new Response(null, {
    status: 204,
  });
};
