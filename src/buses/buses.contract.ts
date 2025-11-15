import { ApiProperty } from "@nestjs/swagger";
import { Bus } from "src/models/buses.model";

export class CreateBusRequest {
  @ApiProperty()
  name: string

  @ApiProperty()
  totalRow: number

  @ApiProperty()
  totalCol: number

  @ApiProperty()
  totalBackseat: number
}

export class FindAllBusesResponse {
  @ApiProperty()
  data: Bus[]
}

export class CreateBusResponse {
  @ApiProperty()
  data: Bus
}