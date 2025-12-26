import { ArgumentMetadata, BadRequestException, Logger, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
import generateerrMsg from "./helpers/generateErrMsg";

export class ModelValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  private readonly logger = new Logger('ModelValidationPipe');

  transform(value: any, metadata: ArgumentMetadata) {
    try {

      this.logger.log(`transform:::value: ${JSON.stringify(value)}`);
      this.logger.log(`transform:::metadata: ${JSON.stringify(metadata)}`);

      if (metadata.type === 'body') {
        const parsed = this.schema.parse(value);
        return parsed;
      }
      return value;
    } catch (err) {
      const errMessage = generateerrMsg(err);
      this.logger.error(`transform:::ERROR: ${errMessage}`);
      throw new BadRequestException('Validation failed');
    }
  }
}