import { ApiProperty } from "@nestjs/swagger";
import { Bus } from "src/models/buses.model";
import z from "zod";

export class CreateBusRequest {
  @ApiProperty()
  name: string

  @ApiProperty()
  totalRow: number

  @ApiProperty()
  totalCol: number

  @ApiProperty({ default: 0 })
  totalBackseat: number
}

export class FindAllBusesResponse {
  @ApiProperty()
  data: Bus[]
}

export class FindOneBusResponse {
  @ApiProperty()
  data: Bus
}

export const busSchema = z.object({
  name: z.string().min(1),
  totalRow: z.number().min(1),
  totalCol: z.number().min(1),
  totalBackseat: z.number().min(0),
}).required();