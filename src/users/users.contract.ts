import { User } from "../models/users.model";

export class FindAllUsersResponse {
  data: User[]
}

export class FindOneUserResponse {
  data: User
}