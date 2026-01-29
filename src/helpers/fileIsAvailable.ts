import constants from "constants";
import { access } from "fs/promises";

export default async function fileIsAvailable(fileName: string): Promise<boolean> {
  try {
    await access(`upload/${fileName}`, constants.F_OK | constants.R_OK | constants.W_OK);
    return true;
  } catch (err) {
    console.error(`not available ${err}`);
    return false;
  }
}