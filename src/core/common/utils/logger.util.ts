import winston, { format } from "winston";
import { namespace } from "../../../core/common/utils/cls.utils";

const hookedFormat = format((info) => {
  const traceId = namespace?.get("traceId");

  if (typeof traceId !== "undefined") {
    info.traceId = traceId;
  }

  return info;
});

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        hookedFormat(),
        winston.format.json(),
        winston.format.errors({ stack: true })
      )
    })
  ]
});

export default logger;
