import { CronProperties } from "src/schedules/schedules.contract";

export default function generateCronProperties(time: string): CronProperties {
  const date = new Date(time);
  const second = date.getSeconds();
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return {
    second,
    minute,
    hour,
    day,
    month,
  }
}