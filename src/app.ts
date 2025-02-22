import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import express from "express";
import { createServer } from "node:http";
const app = express();
import swaggerUi from "swagger-ui-express";
import { container } from "tsyringe";
import rateLimit from "express-rate-limit";

import helmet from "helmet";
import compression from "compression";
import {
  ResponseMiddleWare,
  NotFoundMiddleWare,
  TraceMiddleWare,
  ErrorHandlerMiddleWare,
  AuthMiddleWare
} from "./middlewares";

import swaggerDocs from "./config/swagger.json";
import { HttpClient } from "./core/common/utils";
import { UserRoute } from "./routes/index";
import cors from "cors";
import { UserService } from "./application/services/index";
import { RedisCache } from "./core/clients/redis";

container.register("IRedisCache", RedisCache);
container.register("IHttpClient", HttpClient);
container.register("IUserService", UserService);
const server = createServer(app);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 3000 // limit each IP to 3000 requests per windowMs
});

// Built-in middleware for parsing JSON
app.use(express.json());

// Built-in middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use(limiter);
app.use(cors());
app.options("*", cors());

// Set up Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.static("public"));

// To improvement performance by compressing server response
app.use(compression());

// Third-party middleware for securing HTTP headers
// Use Helmet for security, with specific options
app.use(helmet());

app.use(TraceMiddleWare, AuthMiddleWare, ResponseMiddleWare);

// route handler for http
app.use("/api/v1/", UserRoute);

app.use(ErrorHandlerMiddleWare, NotFoundMiddleWare);

const PORT = process.env.PORT || 8080;
// Required to use port 8080 for AWS Elastic BeanStalk
server.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

export default app;
