import { ApiProperty } from "@nestjs/swagger";
import { User } from "../models/users.model";

export class UpdateProfileRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  newUserId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  cardImageUrl?: string;
}
export class FindAllUsersResponse {
  data: User[]
}

export class UploadResponse {
  data: {
    filePath: string;
  }
}

export class FindOneUserResponse {
  data: User
}