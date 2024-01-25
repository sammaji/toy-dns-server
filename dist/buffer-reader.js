export default class BufferReader {
    buffer;
    position;
    constructor(buffer, position = 0) {
        this.buffer = buffer;
        this.position = position;
    }
    isEndOfBuffer(offset = 0) {
        return this.position + offset >= 512;
    }
    throwEndOfBuffer(offset = 0) {
        if (this.isEndOfBuffer(offset))
            throw Error("End of Buffer: Packet size is limited to 512 bytes");
    }
    length() {
        return this.buffer.length - this.position;
    }
    /**
     * change the buffer position
     */
    seek(position) {
        this.position = position;
    }
    /**
     * Skips `x` steps ahead
     */
    skip(x = 1) {
        this.position += x;
    }
    /** read a single byte, without changing the buffer */
    get(pos = this.position) {
        return this.buffer.readUint8(pos);
    }
    getRange(start, len) {
        return this.buffer.toString("utf8", start, start + len);
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
    readStrN(n, encoding = "ascii") {
        const element = this.buffer.toString(encoding, this.position, this.position + n);
        this.position += n;
        return element;
    }
}
