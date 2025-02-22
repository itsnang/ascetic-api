import HTTP_STATUS from "../core/common/enums/http-status.enum";

const NotFoundMiddleWare = async function (__: any, res: any, next: () => void) {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: "Not Found"
  });
};

export default NotFoundMiddleWare;
