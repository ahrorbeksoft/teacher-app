import type { AppSchema } from "@/instant.schema";
import type { InstaQLResult } from "@instantdb/react";
import type { LinkProps } from "@tanstack/react-router";
import type { languages } from "./constants";

export type Profile = InstaQLResult<
  AppSchema,
  {
    profiles: {};
  }
>["profiles"][number];

export type Student = InstaQLResult<
  AppSchema,
  {
    students: {
      subscriptions: {
        group: {};
      };
    };
  }
>["students"][number];

export type Group = InstaQLResult<
  AppSchema,
  {
    groups: {};
  }
>["groups"][number];

export type Locale = (typeof languages)[number]["code"];

export interface LanguageState {
  currentLocale: Locale;
}

export type GoogleData = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nonce: string;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
};

export type NavItem = {
  title: string;
  url: Exclude<LinkProps["to"], undefined>;
  icon?: React.ElementType;
};
