import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosBasicCredentials
} from "axios";
import axiosRetry from "axios-retry";
import { get, isNull, omit } from "lodash";
import { URLSearchParams } from "url";
import { parse, stringify } from "flatted";
import HTTP_STATUS from "../enums/http-status.enum";

const API_DEFAULT_TIME_OUT = 10000;
const API_DEFAULT_DELAY = 1000;
const API_DEFAULT_RETRY = 3;

interface IHttpClient {
  get(url: string): Promise<AxiosResponse<any, any>>;

  fetch(
    baseUrl: string,
    url: string,
    method: Method,
    headers: Record<string, string>,
    body?: Record<string, string | number | boolean | any>,
    auth?: AxiosBasicCredentials,
    queryParams?: Record<string, string | number | boolean>,
    isForm?: boolean
  ): Promise<AxiosResponse<any, any>>;
}

class HttpClient implements IHttpClient {
  private timeout: number;
  private retryDelay: number;
  private retryCount: number;
  constructor() {
    this.timeout = API_DEFAULT_TIME_OUT;
    this.retryDelay = API_DEFAULT_DELAY;
    this.retryCount = API_DEFAULT_RETRY;
  }

  get = async (url: string): Promise<AxiosResponse<any, any>> => {
    return axios.get(url);
  };

  fetch = async (
    baseUrl: string,
    url: string,
    method: Method,
    headers: Record<string, string>,
    body?: Record<string, string | number | boolean | any>,
    auth?: AxiosBasicCredentials,
    queryParams?: Record<string, string | number | boolean>,
    isForm = false
  ): Promise<AxiosResponse<any, any>> => {
    const formData = new URLSearchParams();
    if (body !== undefined && isForm) {
      for (const key in body) {
        formData.append(key, String(body[key]));
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      baseURL: baseUrl,
      url: url,
      method: method,
      timeout: this.timeout,
      headers: headers,
      data: isForm ? formData : body,
      params: queryParams,
      auth: auth,
      responseType: "json",
      responseEncoding: "utf8"
    };
    const axiosInstance: AxiosInstance = axios;

    axiosRetry(axiosInstance, {
      retries: this.retryCount,
      shouldResetTimeout: true,
      retryDelay: (retryCount) => {
        const delayTime = retryCount * this.retryDelay;
        return delayTime;
      },
      retryCondition: (error: AxiosError) => {
        const axiosError = parse(stringify(error));

        const errorConfig: AxiosRequestConfig<any> | null = get(error, "config", null);
        const errorStatus: number = get(error, "response.status", HTTP_STATUS.NOT_FOUND);
        const errorCode: string = get(error, "code", "Unknown");

        if (
          !isNull(errorConfig) &&
          (errorStatus === HTTP_STATUS.REQUEST_TIMEOUT ||
            errorStatus === HTTP_STATUS.TOO_MANY_REQUESTS ||
            errorStatus === HTTP_STATUS.INTERNAL_SERVER_ERROR ||
            errorStatus === HTTP_STATUS.UNAUTHORIZED ||
            errorCode === HTTP_STATUS.ECONNABORTED)
        ) {
          return true;
        }
        return false;
      }
    });

    try {
      const response: AxiosResponse<any, any> = await axiosInstance.request(axiosConfig);
      return response;
    } catch (error: any) {
      const response: any = {
        status: get(error, "response.status", 404),
        data: get(error, "response.data", {
          message: "Error Not Found"
        })
      };
      const errorResponse = get(error, "response", null);
      const errorRequest = get(error, "request", null);
      const errorCode = get(error, "code", null);
      const errorMessage = get(error, "message", null);
      if (!isNull(errorResponse)) {
        const message = parse(stringify(get(error, "response", null)));
        response.data = {
          message: message
        };
      } else if (!isNull(errorCode) && !isNull(errorMessage)) {
        const code = get(error, "code", null);
        const message = get(error, "message", null);
        let stack = parse(stringify(error));
        stack = omit(stack, ["config.headers.Authorization"]);
        const status =
          HTTP_STATUS.ECONNABORTED === code
            ? HTTP_STATUS.REQUEST_TIMEOUT
            : HTTP_STATUS.NOT_FOUND;
        response.status = status;
        response.data = {
          code: code,
          message: message,
          stack: stack
        };
      } else if (!isNull(errorRequest)) {
        const message = parse(stringify(get(error, "request", null)));
        response.data = {
          message: message
        };
      } else {
        const message = parse(stringify(get(error, "message", null)));
        const stack = parse(stringify(error));
        response.data = {
          message: message,
          stack: stack
        };
      }
      return response;
    }
  };
}

export default HttpClient;
