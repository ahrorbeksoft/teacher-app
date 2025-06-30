export const APP_ID = "0ab172d4-2ea6-474d-8bb8-d41961700bda";

import RuFlagIcon from "@/components/icons/ru";
import UsFlagIcon from "@/components/icons/us";
import UzFlagIcon from "@/components/icons/uz";
import en_messages from "@/locales/en.json";
import ru_messages from "@/locales/ru.json";
import uz_messages from "@/locales/uz.json";

export const languages = [
  { code: "en", label: "English", icon: UsFlagIcon, messages: en_messages },
  { code: "ru", label: "Русский", icon: RuFlagIcon, messages: ru_messages },
  { code: "uz", label: "O‘zbekcha", icon: UzFlagIcon, messages: uz_messages },
] as const;

// gotta change this one too to set up auth
export const google_client =
  "481499818820-t0pid9jk2sgrfsealrha9h6r123552og.apps.googleusercontent.com";

export const payment_day = ["firstDay", "lastDay", "enrollmentDay"] as const;
export const lesson_days = [
  "mondays",
  "tuesdays",
  "everyday",
  "weekends",
  "custom",
] as const;
export const week_days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
