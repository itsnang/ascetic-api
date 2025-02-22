import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { namespace } from "../core/common/utils/cls.utils";

const TraceMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    next();
    return;
  }

  namespace.bind(req as any);
  namespace.bind(res as any);

  const traceId = req.query.traceId ? req.params.traceId : uuidv4();
  (req as any)["traceId"] = traceId;

  namespace.run(() => {
    namespace.set("traceId", traceId);
    res.header("x-request-id", traceId);
    next();
  });
};

export default TraceMiddleWare;
