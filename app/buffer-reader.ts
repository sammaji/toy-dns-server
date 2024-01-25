export default class BufferReader {
  buffer: Buffer;
  position: number;

  constructor(buffer: Buffer, position = 0) {
    this.buffer = buffer;
    this.position = position;
  }

  length() {
    return this.buffer.length - this.position;
  }

  isEndOfBuffer(offset: number = 0) {
    return this.position + offset >= 512
  }

  throwEndOfBuffer(offset: number = 0) {
    if (this.isEndOfBuffer(offset)) throw Error("End of Buffer: Packet size is limited to 512 bytes");
  }


  /**
   * change the buffer position
   */
  seek(position: number) {
    this.position = position;
  }

  /**
   * Skips `x` steps ahead
   */
  skip(x: number = 1) {
    this.position += x;
  }

  /** read a single byte, without changing the buffer */
  get(pos: number = this.position) {
    return this.buffer.readUint8(pos);
  }

  readUInt8() {
    const element = this.buffer.readUInt8(this.position);
    this.position++;
    return element;
  }

  readUInt16BE() {
    const element = this.buffer.readUInt16BE(this.position);
    this.position += 2;
    return element;
  }

  readUInt32BE() {
    const element = this.buffer.readUInt16BE(this.position);
    this.position += 4;
    return element;
  }

  readStrN(n: number, encoding: BufferEncoding = "ascii") {
    const element = this.buffer.toString(
      encoding,
      this.position,
      this.position + n,
    );
    this.position += n;
    return element;
  }
}
