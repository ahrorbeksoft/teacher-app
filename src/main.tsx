import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider, useTranslations } from "use-intl";
import { languages } from "./lib/constants.ts";
import { languageStore } from "./lib/stores.ts";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    // biome-ignore lint/style/noNonNullAssertion: <no need to worry about this>
    t: undefined!,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function TranslationProvider() {
  const t = useTranslations();
  return <RouterProvider router={router} context={{ t }} />;
}

function AppWithIntl() {
  const currentLocale = useStore(languageStore, (state) => state.currentLocale);
  const language =
    languages.find((l) => l.code === currentLocale) || languages[0];

  return (
    <IntlProvider
      locale={language.code}
      messages={language.messages}
      now={new Date()}
      timeZone="Asia/Tashkent"
      formats={{
        dateTime: {
          default: {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          },
        },
      }}
    >
      <TranslationProvider />
    </IntlProvider>
  );
}

function App() {
  return (
    <StrictMode>
      <AppWithIntl />
    </StrictMode>
  );
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
