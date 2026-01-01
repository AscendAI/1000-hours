import posthog from "posthog-js";

const NEXT_PUBLIC_POSTHOG_KEY =
  "phc_GgZ9dC9ukqEmbgW3qmxVbxhG44ZCtH3lsDxuUt8iXNp";

posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: '/ph',
  ui_host: 'https://us.posthog.com',
  defaults: "2025-11-30",
})