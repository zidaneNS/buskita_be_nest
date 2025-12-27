import { ApiProperty } from "@nestjs/swagger";
import { Seat } from "src/models/seats.model";

export class UpdateSeatRequest {
  @ApiProperty()
  seatId: string;
}
export class FindOneSeatResponse {
  @ApiProperty()
  data: Seat;
}

export class FindAllSeatResponse {
  @ApiProperty()
  data: Seat[];
}