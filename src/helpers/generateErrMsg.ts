export default function generateErrMsg(err: any) {
  console.error(err);
  return err instanceof Error ? err.message : String(err);
}