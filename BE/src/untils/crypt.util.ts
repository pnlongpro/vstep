// import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class CryptUtil {
  private static SALT_LENGTH = 11;

  static createHash(password) {
    const salt = this.generateSalt(CryptUtil.SALT_LENGTH);
    const hash = this.md5(password + salt);
    return salt + hash;
  }

  static validateHash(password: string, hash: string) {
    const salt = hash.substr(0, CryptUtil.SALT_LENGTH);
    const validHash = salt + this.md5(password + salt);
    return hash === validHash;
  }

  private static generateSalt(len) {
    const set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    const setLen = set.length;
    let salt = '';
    for (let i = 0; i < len; i++) {
      const p = Math.floor(Math.random() * setLen);
      salt += set[p];
    }
    return salt;
  }

  private static md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
  }
}
