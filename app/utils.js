/**
 * Domain name is split into labels, eg in google.com, there are two labels: google, com.
 *
 * For each label, we first append size of the buffer followed by content, then null byte.
 * eg, google becomes \x06google\x00.
 */
const encodeName = (name) => {
  const labels = name.split(".");
  const nameBuf = Buffer.alloc(name.length + 2);
  let offset = 0;
  labels.forEach((label) => {
    if (!label) return;

    nameBuf.writeUInt8(label.length, offset++);
    nameBuf.write(label, offset);
    offset += label.length;
  });

  return nameBuf;
};

const decodeName = (buf, start = 0) => {
  let offset = start;
  let labels = [];

  while (offset < buf.length) {
    const length = buf.readUint8(offset++);

    // terminate when null character is encountered
    if (length === 0) break;

    const label = buf.toString("ascii", offset, offset + length);
    labels.push(label);
    offset += length;
  }

  return labels.join(".");
};

const decodeIPv4 = (buf, start = 0) => {};

const encodeIPv4 = (addr) => {
  const seg = addr.split(".");
  const ipBuf = Buffer.alloc(4);

  let offset = 0;
  seg.forEach((x) => ipBuf.writeUInt8(parseInt(x), offset++));
  return ipBuf;
};

const readflags = (flags) => {
  const qr = (flags >> 15) & 0b1;
  const opcode = (flags >> 11) & 0b1111;
  const aa = (flags >> 10) & 0b1;
  const tc = (flags >> 9) & 0b1;
  const rd = (flags >> 8) & 0b1;
  const ra = (flags >> 7) & 0b1;
  const z = (flags >> 4) & 0b111;
  const rcode = flags & 0b1111;
  return { qr, opcode, aa, tc, rd, ra, z, rcode };
};

module.exports = { encodeName, encodeIPv4, decodeName, decodeIPv4, readflags };
