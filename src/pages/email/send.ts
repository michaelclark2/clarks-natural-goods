import type { APIRoute } from "astro";
import sendGrid from "@sendgrid/mail";
sendGrid.setApiKey(import.meta.env.SENDGRID_API_KEY);

export const POST: APIRoute = async ({ request }: { request: Request }) => {
  const data = await request.json();

  const emailToAdd = data.email;

  if (!emailToAdd) {
    return new Response(null, {
      status: 400,
    });
  }

  const emailEncoded = btoa(emailToAdd.toString());

  const addEmailTransactionResponses: { result: number }[] = await fetch(
    import.meta.env.KV_REST_API_URL + "/multi-exec",
    {
      // expire in 3 days
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
    const confirmUrl =
      `${import.meta.env.VERCEL_ENV === "preview" ? import.meta.env.VERCEL_BRANCH_URL : import.meta.env.SITE}/email/confirm/` +
      encodeURI(emailEncoded);

    const message = {
      to: emailToAdd,
      from: import.meta.env.EMAIL_ADDRESS,
      templateId: "d-33ed46c01674433683c6b767cfe0e087",
      dynamicTemplateData: {
        confirm_url: confirmUrl,
      },
    };

    await sendGrid
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
