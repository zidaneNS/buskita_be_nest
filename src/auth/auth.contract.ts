import { ApiProperty } from "@nestjs/swagger";

export class SignInRequest {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  password: string;
}