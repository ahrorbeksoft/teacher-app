// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  /**
   * Welcome to Instant's permission system!
   * Right now your rules are empty. To start filling them in, check out the docs:
   * https://www.instantdb.com/docs/permissions
   *
   * Here's an example to give you a feel:
   * posts: {
   *   allow: {
   *     view: "true",
   *     create: "isOwner",
   *     update: "isOwner",
   *     delete: "isOwner",
   *   },
   *   bind: ["isOwner", "auth.id != null && auth.id == data.ownerId"],
   * },
   */
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
