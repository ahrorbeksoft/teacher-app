import { Button } from "@/components/extendui/button";
import { GoogleButton } from "@/components/google-button";
import { db } from "@/lib/db";
import { profileStore } from "@/lib/stores";
import type { GoogleData } from "@/lib/types";
import { timestamps } from "@/lib/utils";
import { id } from "@instantdb/react";
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { jwtDecode } from "jwt-decode";
import {
  Award,
  BarChart3,
  Calendar,
  ClipboardCheck,
  MessageSquare,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (profileStore.state) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LandingPage,
});

export default function LandingPage() {
  const t = useTranslations();
  const [nonce] = useState(crypto.randomUUID());

  const profile = useStore(profileStore);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xl font-bold">TeacherApp</span>
          </div>
          <div className="flex items-center gap-4">
            {profile ? (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
                asChild
              >
                <Link to="/">Dashboard</Link>
              </Button>
            ) : (
              <GoogleButton
                nonce={nonce}
                text="signup_with"
                onSuccess={async ({ credential }) => {
                  if (credential) {
                    const googleData = jwtDecode<GoogleData>(credential);

                    try {
                      const { user } = await db.auth.signInWithIdToken({
                        clientName: "google-web",
                        idToken: credential,
                        nonce,
                      });

                      // if the user signs in
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

                        const userProfile = data.profiles?.[0];

                        await db.transact(
                          db.tx.profiles[userProfile?.id ?? id()]
                            .update({
                              firstName: googleData.given_name,
                              lastName: googleData.family_name,
                              avatar: googleData.picture,
                              email: user.email,
                              nameOrder: "first",
                              ...timestamps(),
                            })
                            .link(userProfile ? {} : { meta: user.id }),
                        );

                        navigate({ to: "/dashboard" });
                      }
                    } catch (err) {
                      toast.error(JSON.stringify(err));
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-emerald-50/30 dark:from-background dark:to-emerald-950/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Simplify Student Management for Educational Centers
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                  TeacherHub helps educators track attendance, manage grades,
                  communicate with students, and analyze performance—all in one
                  place.{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    100% Free. Forever.
                  </span>
                </p>
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white text-lg px-8"
                >
                  Start Using Now
                </Button>
              </div>
              <div className="relative h-[350px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl dark:shadow-emerald-900/20">
                {/* <img
									src="/placeholder.svg?height=500&width=600"
									alt="Teacher using TeacherHub dashboard"
									className="object-cover"
								/> */}
              </div>
            </div>

            {/* Feature Icons */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-3">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-medium">Student Management</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-3">
                  <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-medium">Attendance Tracking</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-3">
                  <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-medium">Grade Management</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-3">
                  <MessageSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-medium">Communication Tools</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-3">
                  <ClipboardCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-medium">Assignment Tracking</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-3">
                  <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-medium">Analytics & Reporting</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm">TeacherHub</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TeacherHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
