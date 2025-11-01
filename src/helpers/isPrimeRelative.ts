export default function isPrimeRelative(curr: number, ref: number) {
  let tempA = ref;
  let tempB = curr;

  while(tempB !== 0) {
    const temp = tempB;
    tempB = tempA % tempB;
    tempA = temp;
  }

  return tempA === 1;
}