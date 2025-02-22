type ApiResponseError = {
  statusCode: number;
  status: string;
  message: string;
  error: { [key: string]: any } | string | undefined;
  timestamp: string;
  endpoint: string;
  method: string;
};

export { ApiResponseError };
