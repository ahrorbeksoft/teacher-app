// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    profiles: i.entity({
      avatar: i.string().optional(),
      firstName: i.string(),
      lastName: i.string(),
      email: i.string().unique().indexed(),

      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    students: i.entity({
      fullName: i.string(),
      privateNumber: i.string().optional(),
      homeNumber: i.string().optional(),
      birthday: i.string().optional(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    groups: i.entity({
      name: i.string(),
      fromTime: i.string().indexed(),
      toTime: i.string().indexed(),
      fromDate: i.date().indexed(),
      toDate: i.date().indexed(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    courses: i.entity({
      name: i.string(),
      subject: i.string().indexed(),
      price: i.string(),
      duration: i.number(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    subscriptions: i.entity({
      fromDate: i.date().indexed(),
      toDate: i.date().indexed(),
      isActive: i.boolean().indexed(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    attendance: i.entity({
      day: i.date().indexed(),
      isPresent: i.boolean().indexed(),
      reason: i.string().optional(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    notes: i.entity({
      text: i.string(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    invoices: i.entity({
      month: i.date().indexed(),
      amount: i.number(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    payments: i.entity({
      amount: i.number(),
      month: i.date().indexed(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    expenses: i.entity({
      date: i.date().indexed(),
      amount: i.number(),
      note: i.string(),
      // timestamps
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
  },
  links: {
    profiles$User: {
      forward: {
        on: "profiles",
        has: "one",
        label: "meta",
        onDelete: "cascade",
        required: true,
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "profile",
        onDelete: "cascade",
      },
    },
    // linkiing everything to the profile
    groupsProfile: {
      forward: {
        on: "groups",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "groups" },
    },
    coursesProfile: {
      forward: {
        on: "courses",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "courses" },
    },
    studentsProfile: {
      forward: {
        on: "students",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "students" },
    },
    subscriptionsProfile: {
      forward: {
        on: "subscriptions",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "subscriptions" },
    },
    attendanceProfile: {
      forward: {
        on: "attendance",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "attendance" },
    },
    notesProfile: {
      forward: {
        on: "notes",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "notes" },
    },
    invoicesProfile: {
      forward: {
        on: "invoices",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "invoices" },
    },
    paymentsProfile: {
      forward: {
        on: "payments",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "payments" },
    },
    expensesProfile: {
      forward: {
        on: "expenses",
        has: "one",
        label: "profile",
        onDelete: "cascade",
        required: true,
      },
      reverse: { on: "profiles", has: "many", label: "expenses" },
    },

    // end
    groupsCourse: {
      forward: {
        on: "groups",
        has: "one",
        label: "course",
        required: true,
        onDelete: "cascade",
      },
      reverse: { on: "courses", has: "many", label: "groups" },
    },
    subscriptionsGroup: {
      forward: {
        on: "subscriptions",
        has: "one",
        label: "group",
        required: true,
        onDelete: "cascade",
      },
      reverse: { on: "groups", has: "many", label: "subscriptions" },
    },
    subscriptionStudent: {
      forward: {
        on: "subscriptions",
        has: "one",
        label: "student",
        required: true,
        onDelete: "cascade",
      },
      reverse: { on: "students", has: "many", label: "subscriptions" },
    },
    attendanceStudent: {
      forward: {
        on: "attendance",
        has: "one",
        label: "student",
        required: true,
        onDelete: "cascade",
      },
      reverse: { on: "students", has: "many", label: "attendance" },
    },
    attendanceSubscription: {
      forward: {
        on: "attendance",
        has: "one",
        label: "subscription",
        required: true,
        onDelete: "cascade",
      },
      reverse: { on: "subscriptions", has: "many", label: "attendance" },
    },
    invoicesSubsciptions: {
      forward: {
        on: "invoices",
        has: "one",
        label: "subscription",
        required: true,
        onDelete: "cascade",
      },
      reverse: { on: "subscriptions", has: "many", label: "invoices" },
    },
    paymentsSubscription: {
      forward: {
        on: "payments",
        has: "one",
        label: "subscription",
        required: true,
        onDelete: "cascade",
      },
      reverse: { on: "subscriptions", has: "many", label: "payments" },
    },
    notesStudent: {
      forward: {
        on: "notes",
        has: "one",
        label: "student",
        required: true,
        onDelete: "cascade",
      },
      reverse: { on: "students", has: "many", label: "notes" },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
