import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { databaseModule, errorHandlerModule } from "./commons/modules";
import { errorExampleModule } from "./modules/error-example";
import { exampleModule } from "./modules/example";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 3001;

const app = new Elysia()
	.use(
		cors({
			// methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
		}),
	)
	.use(errorHandlerModule)
	.use(databaseModule)
	.use(exampleModule)
	.use(errorExampleModule)
	.get("/", () => "Hello Elysia")
	.use(
		openapi({
			documentation: {},
		}),
	)
	.listen(PORT);

logger.info(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

process.on("uncaughtException", (error) => {
	logger.fatal("Uncaught Exception", {
		error: error.message,
		stack: error.stack,
	});
	process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at:", { promise, reason });
});

export type App = typeof app;
export * as requestTypes from "./commons/types";
export * as databaseTypes from "./database/types";
