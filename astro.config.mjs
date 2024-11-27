import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

import partytown from "@astrojs/partytown";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://clarksnaturalgoods.com",
  integrations: [tailwind({ applyBaseStyles: false }), partytown(), react()],
  output: "server",
  adapter: vercel({ webAnalytics: { enabled: true } }),
});
