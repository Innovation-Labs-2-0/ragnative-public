import { createSHA256 } from "hash-wasm";

class CheckSum {
  constructor(file) {
    this.file = file;
  }

  async calculateChecksum() {
    const sha256 = await createSHA256();
    sha256.init();

    const reader = this.file.stream().getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      sha256.update(value);
    }

    return sha256.digest("hex");
  }
}

export default class FileUtil {
  constructor(file) {
    this.file = file;
    this.checksum = new CheckSum(file);
  }

  async getChecksum() {
    return await this.checksum.calculateChecksum();
  }
}
