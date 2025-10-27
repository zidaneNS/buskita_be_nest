import { HttpStatus } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class DefaultResponse<T> {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  payloads?: T
}