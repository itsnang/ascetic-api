import HTTP_STATUS from "../enums/http-status.enum";
import { CustomError } from "./custom-error.exception";

export default class UnauthorizeException extends CustomError {
  private readonly _status: string;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: any };

  constructor(params?: {
    code?: number;
    message?: string;
    logging?: boolean;
    context?: { [key: string]: any };
  }) {
    const { message, logging } = params || {};

    super(message || "Unauthorized");
    this._code = HTTP_STATUS.UNAUTHORIZED;
    this._status = "UNAUTHORIZED";
    this._logging = logging || false;
    this._context = params?.context || {};

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, UnauthorizeException.prototype);
  }

  get errors() {
    return [{ status: this._status, message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._code;
  }

  get logging() {
    return this._logging;
  }
}
