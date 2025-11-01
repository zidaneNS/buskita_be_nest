export default function isPrime(value: number) {
  if (value <= 1) return false;
  if (value === 2) return false;
  if (value % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(value) ; i += 2) {
    if (value % i === 0) return false;
  }

  return true;
}