import schema from "@/instant.schema";
import { init } from "@instantdb/react";
import { APP_ID } from "./constants";

export const db = init({ appId: APP_ID, schema, devtool: false });
