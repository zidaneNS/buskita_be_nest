import { ArgumentMetadata, BadRequestException, Logger, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ModelValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  private readonly logger = new Logger('ModelValidationPipe');

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.logger.log(`transform:::value: ${JSON.stringify(value)}`);
      this.logger.log(`transform:::metadata: ${JSON.stringify(metadata)}`);

      const parsed = this.schema.parse(value);
      return parsed;
    } catch (err) {
      this.logger.error(`transform:::ERROR: ${JSON.stringify(err)}`);
      throw new BadRequestException('Validation failed');
    }
  }
}