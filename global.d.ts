import { languages } from "./src/lib/constants";
import messages from "./src/locales/en.json";

declare module "use-intl" {
  interface AppConfig {
    Locale: (typeof languages)[number]["code"];
    Messages: typeof messages;
    // Formats: typeof formats;
  }
}
