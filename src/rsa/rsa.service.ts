import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import isPrime from 'src/helpers/isPrime';
import isPrimeRelative from 'src/helpers/isPrimeRelative';
import responseTemplate from 'src/helpers/responseTemplate';
import { DecryptRequest, EncryptRequest, GenerateEValueRequest, GenerateEValueResponse, GenerateKeyRequest, GenerateKeyResponse, ParseJSONRequest, ReturnJSONRequest } from './rsa.contract';
import { DefaultResponse } from 'src/app.contract';
import modPow from 'src/helpers/modPow';

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

    const plainToAscii = plainArray.map(char => char.charCodeAt(0));
    const cipherArray = plainToAscii.map(ascii => modPow(ascii, eValue, nValue));
    const cipherText = cipherArray.map(cipher => cipher.toString().padStart(totalPad, '0'));
    // const cipherText = plainArray.map(char => {
    //   const asciiCode = char.charCodeAt(0);
    //   const cipher = modPow(asciiCode, eValue, nValue);
    //   return cipher.toString().padStart(totalPad, '0');
    // });

    console.log('cipher', cipherText);

    return responseTemplate(HttpStatus.OK, 'cipher text', {
      plainToAscii,
      cipherArray,
      cipherText,
      result: cipherText.join('')
    });
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

    // const decrypted = splittedCipher.map(cipher => {
    //   const asciiCipher = parseInt(cipher);
    //   const asciiPlain = modPow(asciiCipher, dValue, nValue);
    //   return String.fromCharCode(asciiPlain);
    // });

    const decrypted = splittedCipher.map(cipher => modPow(parseInt(cipher), dValue, nValue));

    const plainText = decrypted.map(item => String.fromCharCode(item));

    console.log('json', plainText.join(''));

    return responseTemplate(HttpStatus.OK, 'decrypted', {
      splittedCipher,
      decrypted,
      plainText,
      result: decrypted.join(''),
      json: JSON.parse(plainText.join(''))
    });
  }

  parseJSON(body: ParseJSONRequest) {
    console.log(JSON.stringify(body));
    return responseTemplate(HttpStatus.OK, 'stringify', JSON.stringify(body));
  }

  returnJSON(query: ReturnJSONRequest): DefaultResponse<ParseJSONRequest> {
    const {inputJSON} = query;

    return responseTemplate(HttpStatus.OK, 'parsed', JSON.parse(inputJSON));
  }
}
