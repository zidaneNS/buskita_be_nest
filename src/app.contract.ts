import { HttpStatus } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Request } from "express";
import { User } from "./models/users.model";

export class DefaultResponse<T> {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  payloads?: T
}

export interface RequestWithUser extends Request {
  user: User
}