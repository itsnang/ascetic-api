import HTTP_STATUS from "../core/common/enums/http-status.enum";

type ApiResponse = {
  statusCode: number;
  data: Record<string, string | number | any> | any;
  message: string;
};

const ResponseMiddleWare = async (__: any, res: any, next: any) => {
  res.ok = async (data: any) => {
    const response: ApiResponse = {
      statusCode: Number(HTTP_STATUS.OK),
      message: "Success",
      data
    };
    return res.status(Number(HTTP_STATUS.OK)).json(response);
  };
  next();
};

export default ResponseMiddleWare;
