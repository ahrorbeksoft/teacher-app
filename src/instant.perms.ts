// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  profiles: {
    bind: ["isAuthor", "auth.id in data.ref('meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  students: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  groups: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  courses: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  subscriptions: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  attendance: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  notes: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  invoices: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  payments: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
  expenses: {
    bind: ["isAuthor", "auth.id in data.ref('profile.meta.id')"],
    allow: {
      view: "isAuthor",
      create: "isAuthor",
      update: "isAuthor",
      delete: "isAuthor",
    },
  },
} satisfies InstantRules;

export default rules;
