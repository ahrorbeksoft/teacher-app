import { type ClassValue, clsx } from "clsx";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  startOfMonth,
} from "date-fns";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";
import { languages, lesson_days, week_days } from "./constants";
import { db } from "./db";
import { languageStore, profileStore } from "./stores";
import type { Locale, Profile } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get initial language from cookie or default to "en"
export function getInitialLanguage(): Locale {
  const savedLocale = Cookies.get("locale") as Locale;
  if (savedLocale && languages.map((l) => l.code).includes(savedLocale)) {
    return savedLocale;
  }
  return "en";
}

// Function to change the language
export function setLanguage(locale: Locale) {
  Cookies.set("locale", locale, { sameSite: "lax" });
  languageStore.setState(() => ({
    currentLocale: locale,
  }));
}

export function getFullName(
  firstName: string | undefined,
  lastName: string | undefined,
  order: "first" | "last" = "first",
) {
  // @ts-ignore
  if (!lastName) lastName = "";
  if (order === "first") {
    return `${firstName} ${lastName}`;
  }
  return `${lastName} ${firstName}`;
}

export function getDateFromTime(time: string | undefined) {
  const [h, m] = time?.split(":") || ["00", "00"];
  const date = new Date();
  date.setHours(Number.parseInt(h || "0"));
  date.setMinutes(Number.parseInt(m || "0"));
  return date;
}

export function getTimeFromDate(date: Date | undefined) {
  if (!date) return "00:00";
  const hours = date.getHours().toString();
  const minutes = date.getMinutes().toString();
  return `${hours === "0" ? "00" : hours.length === 1 ? `0${hours}` : hours}:${minutes === "0" ? "00" : minutes.length === 1 ? `0${minutes}` : minutes}`;
}

export async function logout() {
  await db.auth.signOut();
  profileStore.setState(() => null as unknown as Profile);
}

export const timestamps = (isNew = true) => {
  if (isNew) {
    return {
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
  }
  return {
    updatedAt: Date.now(),
  };
};

export function getLessonDatesInFirstMonth(
  lesson_day: (typeof lesson_days)[number],
  startDate: Date,
  endDate: Date,
  customDays?: (typeof week_days)[number][],
): Date[] {
  const monthEnd = endOfMonth(startDate);
  const finalDate = isBefore(endDate, monthEnd) ? endDate : monthEnd;

  const days = eachDayOfInterval({ start: startDate, end: finalDate });

  const weekdayMap: Record<(typeof week_days)[number], number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  let validWeekdays: number[] = [];

  switch (lesson_day) {
    case "everyday":
      validWeekdays = [1, 2, 3, 4, 5, 6];
      break;
    case "weekends":
      validWeekdays = [0, 6]; // Sunday and Saturday
      break;
    case "mondays":
      validWeekdays = [1, 3, 5];
      break;
    case "tuesdays":
      validWeekdays = [2, 4, 6];
      break;
    case "custom":
      if (!customDays || customDays.length === 0) {
        throw new Error(
          "Custom lesson days must be provided when lesson_day is 'custom'",
        );
      }
      validWeekdays = customDays.map((day) => weekdayMap[day]);
      break;
  }

  return days.filter((date) => validWeekdays.includes(date.getDay()));
}

export function getLessonDatesGroupedByMonth(
  lesson_day: (typeof lesson_days)[number],
  startDate: Date,
  endDate: Date,
  customDays?: (typeof week_days)[number][],
): { month: Date; lessons: Date[] }[] {
  const weekdayMap: Record<(typeof week_days)[number], number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  let validWeekdays: number[] = [];

  switch (lesson_day) {
    case "everyday":
      validWeekdays = [1, 2, 3, 4, 5, 6];
      break;
    case "weekends":
      validWeekdays = [0, 6];
      break;
    case "mondays":
      validWeekdays = [1, 3, 5];
      break;
    case "tuesdays":
      validWeekdays = [2, 4, 6];
      break;
    case "custom":
      if (!customDays || customDays.length === 0) {
        throw new Error(
          "Custom lesson days must be provided when lesson_day is 'custom'",
        );
      }
      validWeekdays = customDays.map((day) => weekdayMap[day]);
      break;
  }

  const result: { month: Date; lessons: Date[] }[] = [];

  let currentMonthStart = startOfMonth(startDate);
  const lastMonthEnd = endOfMonth(endDate);

  while (!isAfter(currentMonthStart, lastMonthEnd)) {
    const currentMonthEnd = endOfMonth(currentMonthStart);

    const rangeStart = isBefore(startDate, currentMonthStart)
      ? currentMonthStart
      : startDate;
    const rangeEnd = isBefore(endDate, currentMonthEnd)
      ? endDate
      : currentMonthEnd;

    const allDays = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

    const lessons = allDays.filter((date) =>
      validWeekdays.includes(date.getDay()),
    );

    result.push({
      month: currentMonthStart,
      lessons,
    });

    currentMonthStart = addMonths(currentMonthStart, 1);
  }

  return result;
}

export function getTotalMonthlyLessons(
  lesson_day: (typeof lesson_days)[number],
  customDays?: (typeof week_days)[number][],
): number {
  switch (lesson_day) {
    case "mondays":
    case "tuesdays":
      return 12;
    case "everyday":
      return 24;
    case "weekends":
      return 6;
    case "custom":
      if (!customDays || customDays.length === 0) {
        throw new Error(
          "Custom weekdays must be provided for 'custom' lesson day.",
        );
      }
      return customDays.length * 4;
    default:
      return 0;
  }
}

export function getMonths(
  startDate: Date | string | number,
  finishDate: Date | string | number,
): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);
  const end = new Date(finishDate);

  const current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    dates.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return dates;
}
