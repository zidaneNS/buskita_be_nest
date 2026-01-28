import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/models/users.model";

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

  @ApiProperty()
  cardImageUrl?: string;
}

export class SignInResponse {
  @ApiProperty()
  data: string;
}

export class SignUpResponse {
  @ApiProperty()
  data: User;
}