import { User } from "../models/users.model";

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