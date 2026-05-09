import { defineRelations } from "drizzle-orm";
import { user } from "./auth";

export const table = {
	user,
} as const;

export const schemaRelations = defineRelations(table, (_r) => ({}));
export type Table = typeof table;
