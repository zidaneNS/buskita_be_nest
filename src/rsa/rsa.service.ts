import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import isPrime from 'src/helper/isPrime';
import isPrimeRelative from 'src/helper/isPrimeRelative';
import responseTemplate from 'src/helper/responseTemplate';
import { DecryptRequest, EncryptRequest, GenerateEValueRequest, GenerateEValueResponse, GenerateKeyRequest, GenerateKeyResponse } from './rsa.contract';
import { DefaultResponse } from 'src/app.contract';
import modPow from 'src/helper/modPow';

@Injectable()
export class RsaService {
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

  generateEValue (body: GenerateEValueRequest): DefaultResponse<GenerateEValueResponse> {
    const { pValue, qValue, total } = body;

    if (!isPrime(pValue) || !isPrime(qValue)) {
      throw new HttpException(`pValue is prime: ${isPrime(pValue)}, qValue is prime: ${isPrime(qValue)}`, HttpStatus.BAD_REQUEST);
    }

    if (total < 1)  throw new HttpException('total must greater than 1', HttpStatus.BAD_REQUEST);

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
      nValue,
      toitent,
      eValues
    });
  }

  generateKey(body: GenerateKeyRequest): DefaultResponse<GenerateKeyResponse> {
    const { eValue, nValue, toitent } = body;

    if (!isPrimeRelative(eValue, toitent)) throw new HttpException('eValue must prime relative toitent', HttpStatus.BAD_REQUEST);

    let dValue = 2;

    while((eValue * dValue) % toitent !== 1) {
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
  }

  encrypt(query: EncryptRequest) {
    const { plaintext } = query;
    const {eValue, nValue} = this.getPublicKey();

    const totalPad = nValue.toString().split('').length;

    const plainArray = plaintext.split('');
    const cipherText = plainArray.map(char => {
      const asciiCode = char.charCodeAt(0);
      const cipher = modPow(asciiCode, eValue, nValue);
      return cipher.toString().padStart(totalPad, '0');
    });

    return responseTemplate(HttpStatus.OK, 'ascii code', cipherText.join(''));
  }

  decrypt(query: DecryptRequest) {
    const {ciphertext} = query;
    const {dValue, nValue} = this.getPrivateKey();

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

    const decrypted = splittedCipher.map(cipher => {
      const asciiCipher = parseInt(cipher);
      const asciiPlain = modPow(asciiCipher, dValue, nValue);
      return String.fromCharCode(asciiPlain);
    })

    return responseTemplate(HttpStatus.OK, 'decrypted', decrypted.join(''));
  }
}
