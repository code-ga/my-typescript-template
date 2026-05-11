// import { PGlite } from "@electric-sql/pglite";

import path from "node:path";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePGlite } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import Elysia from "elysia";
import { schemaRelations, table } from "../../database/schema";
import { logger } from "../../utils/logger";

const isProduction = process.env.NODE_ENV === "production";

const dbUrl = process.env.DATABASE_URL?.replace(/^"|"$/g, "") || "memory://";

export const databaseModule = new Elysia({ name: "drizzle-database" })
	.decorate(
		"db",
		isProduction
			? drizzlePostgres(dbUrl, {
					schema: table,
					relations: schemaRelations,
				})
			: drizzlePGlite(dbUrl, { schema: table, relations: schemaRelations }),
	)
	.onStart(async (e) => {
		if (!isProduction) {
			try {
				logger.info("Running migrations...");
				await migrate(e.decorator.db, {
					migrationsFolder: path.join(__dirname, "../../../drizzle"),
				});
				logger.info("Migrations complete.");
			} catch (error) {
				logger.error("Error running migrations:", error);
			}
		}
	});