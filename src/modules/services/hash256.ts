import crypto from "crypto";

export function hash256(str: string) {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}
