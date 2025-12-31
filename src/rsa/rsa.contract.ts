import { ApiProperty } from "@nestjs/swagger";

export class GenerateEValueRequest {
  @ApiProperty({ default: 20113 })
  pValue: number;

  @ApiProperty({ default: 31123 })
  qValue: number;

  @ApiProperty({ default: 10 })
  total: number;
}

export class GenerateKeyRequest {
  @ApiProperty({ default: 395 })
  eValue: number;

  @ApiProperty({ default: 625976899 })
  nValue: number;

  @ApiProperty({ default: 625925664 })
  toitent: number;
}

export class EncryptRequest {
  @ApiProperty()
  plaintext: string;
}

export class DecryptRequest {
  @ApiProperty()
  ciphertext: string;
}

export class GenerateEValueResponse {
  @ApiProperty()
  data: {
    nValue: number;
    toitent: number;
    eValues: number[];
  }
}

export class GenerateKeyResponse {
  @ApiProperty()
  publicKey: PublicKey;

  @ApiProperty()
  privateKey: PrivateKey;
}

export class GetKeyResponse {
  @ApiProperty()
  data: PublicKey;
}