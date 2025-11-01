export default function modPow(base: number, exp: number, mod: number) {
  let result = base % mod;

  for (let i = exp; i > 1; i--) {
    result = (result * base) % mod;
  }

  return result;
}