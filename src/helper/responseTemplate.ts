import { HttpStatus } from "@nestjs/common";
import { DefaultResponse } from "src/app.contract";

export default function responseTemplate<T>(statusCode: HttpStatus, message: string, payloads?: T): DefaultResponse<T> {
  return {
    statusCode,
    message,
    payloads
  }
}