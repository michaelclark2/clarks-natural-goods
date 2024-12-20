import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://clarksnaturalgoods.com",
  integrations: [tailwind(), partytown()],
  output: "server",
  adapter: vercel({ webAnalytics: { enabled: true } }),
});
