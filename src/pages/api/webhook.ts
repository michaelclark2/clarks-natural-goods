import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify({ message: "You got GOT!" }));
};
export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  return new Response(JSON.stringify({ message: data }));
};
