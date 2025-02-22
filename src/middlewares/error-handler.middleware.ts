import { Request, Response, NextFunction } from "express";
import HTTP_STATUS from "../core/common/enums/http-status.enum";
import { CustomError } from "../core/common/exceptions/custom-error.exception";
import { ZodError } from "zod";
import { isEmpty } from "lodash";
import { DateTime } from "luxon";
import { ApiResponseError } from "../data/interface/api-response-error.interface";

const ErrorHandlerMiddleWare = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (err instanceof ZodError) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(<ApiResponseError>{
      statusCode: Number(HTTP_STATUS.UNPROCESSABLE_ENTITY),
      status: "Error",
      message: "Unprocessable Entity",
      error: err.issues,
      timestamp: DateTime.local().toISO(),
      endpoint: req.path,
      method: req.method
    });
  }

  if (err instanceof CustomError) {
    const { statusCode, logging, errors } = err;
    if (logging) {
      console.error(
        JSON.stringify(
          {
            statusCode: err.statusCode,
            errors: err.errors,
            stack: err.stack
          },
          null,
          2
        )
      );
    }

    let errorStatus = "Error";

    let errorContext: any = err.stack;

    if (!isEmpty(errors[0].status)) {
      errorStatus = errors[0].status;
    }

    if (!isEmpty(errors[0].context)) {
      errorContext = errors[0].context;
    }
    return res.status(statusCode).send(<ApiResponseError>{
      statusCode: err.statusCode,
      message: err.message,
      status: errorStatus,
      error:
        process.env.APP_ENV === "qa" || process.env.APP_ENV === "dev"
          ? errorContext
          : undefined,
      timestamp: DateTime.local().toISO(),
      endpoint: req.path,
      method: req.method
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(<ApiResponseError>{
    statusCode: Number(HTTP_STATUS.INTERNAL_SERVER_ERROR),
    message: err.message,
    status: "INTERNAL_SERVER_ERROR",
    error:
      process.env.APP_ENV === "qa" || process.env.APP_ENV === "dev"
        ? err.stack
        : undefined,
    timestamp: DateTime.local().toISO(),
    endpoint: req.path,
    method: req.method
  });
};

export default ErrorHandlerMiddleWare;
