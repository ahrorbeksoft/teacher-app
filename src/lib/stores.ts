import { Store } from "@tanstack/react-store";
import type { LanguageState, Profile } from "./types";
import { getInitialLanguage } from "./utils";

export const profileStore = new Store<Profile>(null as unknown as Profile);
export const isInitialLoad = new Store(false);
export const updateCount = new Store(0);

export const languageStore = new Store<LanguageState>({
  currentLocale: getInitialLanguage(),
});
