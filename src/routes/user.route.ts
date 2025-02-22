import express, { Request } from "express";
import { container } from "tsyringe";

import { logger, formatLoggerResponse } from "../core/common/utils/index";

import { UserController } from "../application/controllers/user.controller";

const router = express.Router();

export const UserRoute = router.get(
  "/users",
  async (req: Request, res: any, next: any) => {
    try {
      const controller = container.resolve(UserController);
      const response = await controller.userServiceHanlder();
      return res.ok(response);
    } catch (error: any) {
      logger.error(formatLoggerResponse(req, res, error));
      next(error);
    }
  }
);
