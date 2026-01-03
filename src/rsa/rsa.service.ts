import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import isPrime from 'src/helpers/isPrime';
import isPrimeRelative from 'src/helpers/isPrimeRelative';
import responseTemplate from 'src/helpers/responseTemplate';
import { DecryptRequest, EncryptRequest, GenerateEValueRequest, GenerateEValueResponse, GenerateKeyRequest, GenerateKeyResponse, GetKeyResponse } from './rsa.contract';
import { DefaultResponse } from 'src/app.contract';
import modPow from 'src/helpers/modPow';
import generateErrMsg from 'src/helpers/generateErrMsg';

@Injectable()
export class RsaService {
  private readonly logger = new Logger('RsaService');

  private privateKey: PrivateKey;
  private publicKey: PublicKey;

  setPrivateKey(key: PrivateKey) {
    this.privateKey = key;
  }

  setPublicKey(key: PublicKey) {
    this.publicKey = key;
  }

  getPrivateKey(): PrivateKey {
    return this.privateKey;
  }

  getPublicKey(): PublicKey {
    return this.publicKey;
  }

  getKey(): DefaultResponse<GetKeyResponse> {
    try {
      this.logger.log('---GET KEY---');
      const key = this.getPublicKey();

      if (!key?.eValue || !key?.nValue) throw new BadRequestException('key not generated please create key first');

      return responseTemplate(HttpStatus.OK, 'get public key', { data: this.getPublicKey() });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`getKet:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  generateEValue(body: GenerateEValueRequest): DefaultResponse<GenerateEValueResponse> {
    try {
      this.logger.log('---GENERATE E VALUE---');
      this.logger.log(`generateEvalue:::body: ${JSON.stringify(body)}`);

      const { pValue, qValue, total } = body;

      if (!isPrime(pValue) || !isPrime(qValue)) {
        throw new HttpException(`pValue is prime: ${isPrime(pValue)}, qValue is prime: ${isPrime(qValue)}`, HttpStatus.BAD_REQUEST);
      }

      if (total < 1) throw new HttpException('total must greater than 1', HttpStatus.BAD_REQUEST);

      const nValue = pValue * qValue;
      const toitent = (pValue - 1) * (qValue - 1);

      let eValues: number[] = [];

      let curr = 2;
      while (eValues.length < total) {
        if (isPrimeRelative(curr, toitent)) {
          eValues.push(curr);
        }
        curr++;
      }

      return responseTemplate<GenerateEValueResponse>(HttpStatus.OK, 'generate E values', {
        data: {
          nValue,
          toitent,
          eValues
        }
      });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`generateEValue:::ERROR: ${errMessage}`);
      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  generateKey(body: GenerateKeyRequest): DefaultResponse<GenerateKeyResponse> {
    try {
      this.logger.log('---GENERATE KEY---');
      this.logger.log(`generateKey:::body: ${JSON.stringify(body)}`);
      const { eValue, nValue, toitent } = body;

      if (!isPrimeRelative(eValue, toitent)) throw new HttpException('eValue must prime relative toitent', HttpStatus.BAD_REQUEST);

      let dValue = 2;

      while ((eValue * dValue) % toitent !== 1) {
        dValue++;
      }

      const privateKey: PrivateKey = { dValue, nValue }
      const publicKey: PublicKey = { eValue, nValue }

      this.setPrivateKey(privateKey);
      this.setPublicKey(publicKey);

      return responseTemplate<GenerateKeyResponse>(HttpStatus.CREATED, 'private key and public key successfully created', {
        privateKey,
        publicKey
      });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`generateKey:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  encrypt(query: EncryptRequest): DefaultResponse<{ data: string }> {
    try {
      this.logger.log('---ENCRYPT---');
      this.logger.log(`encrypt:::query: ${JSON.stringify(query)}`);

      const { plaintext } = query;
      const { eValue, nValue } = this.getPublicKey();

      const totalPad = nValue.toString().split('').length;

      const plainArray = plaintext.split('');

      const cipherText = plainArray.map(char => {
        const asciiCode = char.charCodeAt(0);
        const cipher = modPow(BigInt(asciiCode), BigInt(eValue), BigInt(nValue));
        return cipher.toString().padStart(totalPad, '0');
      });

      console.log('cipher', cipherText);

      return responseTemplate(HttpStatus.OK, 'cipher text', { data: cipherText.join('') });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`encrypt:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  decrypt(query: DecryptRequest): DefaultResponse<{ data: string }> {
    try {
      this.logger.log('---DECRYPT---');
      this.logger.log(`decrypt:::query: ${JSON.stringify(query)}`);
      const { ciphertext } = query;
      const { dValue, nValue } = this.getPrivateKey();

      const totalPad = nValue.toString().split('').length;

      const splittedCipher: string[] = [];
      let mBlock: string[] = [];
      ciphertext.split('').forEach(char => {
        mBlock.push(char);
        if (mBlock.length === totalPad) {
          splittedCipher.push(mBlock.join(''));
          mBlock = [];
        }
      });

      const decrypted = splittedCipher.map(cipher => modPow(BigInt(parseInt(cipher)), BigInt(dValue), BigInt(nValue)));

      const plainText = decrypted.map(item => String.fromCharCode(Number(item)));

      console.log('json', plainText.join(''));

      return responseTemplate(HttpStatus.OK, 'decrypted', { data: plainText.join('') });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`decrypt:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, 500);
    }
  }
}
