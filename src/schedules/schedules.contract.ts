import { ApiProperty } from "@nestjs/swagger";
import { Bus } from "src/models/buses.model";
import { Schedule } from "src/models/schedules.model";
import { Seat } from "src/models/seats.model";
import z from "zod";

export class CreateScheduleRequest {
  @ApiProperty()
  time: string;

  @ApiProperty()
  busId: string;

  @ApiProperty()
  routeId: string;

  @ApiProperty()
  isClosed: boolean;
}

export class FindOneScheduleResponse {
  @ApiProperty()
  data: Schedule;
}

export class FindAllScheduleResponse {
  @ApiProperty()
  data: Partial<ScheduleWithSeatInfo>[];
}

export class ScheduleWithSeatInfo extends Schedule {
  totalUser: number;
  totalSeats: number;
}

export class SeatWithScheduleStats extends Seat {
  declare schedule: ScheduleWithSeatInfo;
}

export class FindAllSeatWithScheduleStats {
  @ApiProperty()
  data: SeatWithScheduleStats[]
}

export class BaseScheduleProperty {
  @ApiProperty()
  scheduleId: string;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  isClosed: boolean;

  @ApiProperty()
  busId: string;

  @ApiProperty()
  routeId: string;

  @ApiProperty()
  bus: Bus;
}

export interface CronProperties {
  second: number;
  minute: number;
  hour: number;
  day: number;
  month: number;
}

export const scheduleSchema = z.object({
  time: z.string().min(1),
  busId: z.string().min(1),
  routeId: z.string().min(1),
  isClosed: z.boolean()
}).required();