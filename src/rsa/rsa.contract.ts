import { ApiProperty } from "@nestjs/swagger";

export class RsaApiContract {
  
}

export class GenerateEValueRequest {
  @ApiProperty()
  pValue: number;

  @ApiProperty()
  qValue: number;

  @ApiProperty({ default: 10 })
  total: number;
}

export class GenerateKeyRequest {
  @ApiProperty({ default: 49 })
  eValue: number;

  @ApiProperty({ default: 713 })
  nValue: number;

  @ApiProperty({ default: 660 })
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

export class ParseJSONRequest {
  @ApiProperty({ default: '123' })
  ticketId: string;

  @ApiProperty({ default: 'zidane' })
  name: string;

  @ApiProperty({ default: '181221055' })
  nim_nip: string;
}

export class ReturnJSONRequest {
  @ApiProperty()
  inputJSON: string;
}

export class GenerateEValueResponse {
  @ApiProperty()
  nValue: number;

  @ApiProperty()
  toitent: number;

  @ApiProperty()
  eValues: number[];
}

export class GenerateKeyResponse {
  @ApiProperty()
  publicKey: PublicKey;

  @ApiProperty()
  privateKey: PrivateKey;
}