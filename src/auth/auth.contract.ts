import { ApiProperty } from "@nestjs/swagger";

export class SignInRequest {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  password: string;
}

export class SignUpRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  roleId: 1 | 2 | 3;

  @ApiProperty()
  userId: string;
}