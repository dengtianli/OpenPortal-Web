import SHA from "sha.js";
import crypto from 'crypto';

export default {
  token: {
    set(name, token) {
      if (token)
        localStorage.setItem(name, token);
    },
    get(name) {
      const token = localStorage.getItem(name)
      return token ? token : undefined;
    },
    empty(name) {
      localStorage.removeItem(name);
    }
  },
  sha(string) {
    return SHA("sha256").update(string, "utf8").digest("hex");
  },
  md5Encrypt(encryptString) {
    return crypto.createHash("md5").update(encryptString, "utf8").digest('hex');
  }
}
