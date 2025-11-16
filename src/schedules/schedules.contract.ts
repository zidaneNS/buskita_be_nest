import { ApiProperty } from "@nestjs/swagger";
import { Schedule } from "src/models/schedules.model";
import z from "zod";

export class CreateScheduleRequest {
  @ApiProperty()
  time: string;

  @ApiProperty()
  busId: string;

  @ApiProperty()
  routeId: string;
}

export class FindOneScheduleResponse {
  @ApiProperty()
  data: Schedule;
}

export class FindAllScheduleResponse {
  @ApiProperty()
  data: Schedule[];
}

export const scheduleSchema = z.object({
  time: z.string().min(1),
  busId: z.string().min(1),
  routeId: z.string().min(1)
}).required();