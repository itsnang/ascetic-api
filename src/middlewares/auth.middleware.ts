import HTTP_STATUS from "../core/common/enums/http-status.enum";
import { ApiResponseError } from "../data/interface/api-response-error.interface";
import { DateTime } from "luxon";
import { isUndefined } from "lodash";

const AuthMiddleWare = async function (req: any, res: any, next: () => void) {
  const apiKey = req?.headers["x-api-key"] ?? undefined;

  if (apiKey === process.env.API_KEY && !isUndefined(apiKey)) {
    next();
  } else if (isUndefined(apiKey) || apiKey === "") {
    const response: ApiResponseError = {
      statusCode: Number(HTTP_STATUS.FORBIDDEN),
      status: "FORBIDDEN",
      message: "Missing API Key",
      error: "Error",
      timestamp: DateTime.local().toISO(),
      endpoint: req.path,
      method: req.method
    };

    return res.status(HTTP_STATUS.FORBIDDEN).json(response);
  } else {
    const response: ApiResponseError = {
      statusCode: Number(HTTP_STATUS.FORBIDDEN),
      status: "FORBIDDEN",
      message: "API Key invalid",
      error: "Error",
      timestamp: DateTime.local().toISO(),
      endpoint: req.path,
      method: req.method
    };

    return res.status(Number(HTTP_STATUS.FORBIDDEN)).json(response);
  }
};

export default AuthMiddleWare;
