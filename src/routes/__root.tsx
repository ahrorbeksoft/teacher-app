import { Button } from "@/components/extendui/button";
// import LoadingScreen from "@/components/loading-screen";
import { ThemeProvider } from "@/components/theme-provider";
import { AlertDialogProvider } from "@/components/ui/alert-dialog-provider";
import { Toaster } from "@/components/ui/sonner";
import { db } from "@/lib/db";
import { isInitialLoad, profileStore } from "@/lib/stores";
import en_messages from "@/locales/en.json";
import {
  Outlet,
  createRootRouteWithContext,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { createTranslator } from "use-intl";

const t = createTranslator({ locale: "en", messages: en_messages });

interface RouterContext {
  t: typeof t;
}
export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    // do things only on the initial load
    if (isInitialLoad) {
      // check if the user signed in
      const user = await db.getAuth();

      // if user exists
      if (user) {
        const { data } = await db.queryOnce({
          profiles: {
            $: {
              where: {
                meta: user.id,
              },
            },
          },
        });

        // if the profile exists, save to the store
        if (data.profiles.length > 0) {
          profileStore.setState(() => data.profiles[0]);
        }
      }

      isInitialLoad.setState(() => false);
    }
  },
  wrapInSuspense: true,
  // pendingComponent: LoadingScreen,
  notFoundComponent: AccessDenied,
  errorComponent: AccessDenied,
  component: RootContainer,
});

function RootContainer() {
  const { user } = db.useAuth();
  const { data } = db.useQuery(
    user ? { profiles: { $: { where: { meta: user.id } } } } : null,
  );
  // const profileUpdateCount = useStore(updateCount);

  // auto updating the user
  useEffect(() => {
    if (data?.profiles?.[0]) {
      // if (profileUpdateCount > 1) {
      profileStore.setState(() => data.profiles[0]);
      // } else {
      // updateCount.setState((prev) => prev + 1);
      // }
    }
  }, [data]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AlertDialogProvider>
        <Outlet />
        <Toaster richColors />
      </AlertDialogProvider>
    </ThemeProvider>
  );
}

// Example of an HTTP client based on fetch
function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">401</h1>
        <span className="font-medium">Access Denied!</span>
        <p className="text-center text-muted-foreground">
          You don't have access <br />
          to this page!
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
