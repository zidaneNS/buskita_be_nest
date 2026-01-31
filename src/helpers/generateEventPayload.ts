import { MessageEventPayload } from "src/event/event.contract";

export default function generateEventPayload(payload: MessageEventPayload): MessageEventPayload {
  return {
    ...payload
  }
}