const createHeaderBuf = ({
  id,
  qr = 1,
  opcode = 0,
  aa = 0,
  tc = 0,
  rd = 0,
  ra = 0,
  z = 0,
  rcode = 0,
  qdcount = 0,
  ancount = 0,
  nscount = 0,
  arcount = 0,
}) => {
  const buf = Buffer.alloc(12);

  buf.writeUInt16BE(id, 0);

  // bit mask to store all the flags
  // << is the bitshift operator
  // y << x will add x no. of zeros after the binary form of y
  // eg, 7 (111) << 4 will give 112 (1110000)
  // | is the bitwise OR operator
  const flags =
    (qr << 15) |
    (opcode << 11) |
    (aa << 10) |
    (tc << 9) |
    (rd << 8) |
    (ra << 7) |
    (z << 4) |
    rcode;
  buf.writeUint16BE(flags, 2);

  buf.writeUint16BE(qdcount, 4);
  buf.writeUint16BE(ancount, 6);
  buf.writeUint16BE(nscount, 8);
  buf.writeUint16BE(arcount, 10);

  return buf;
};


const readHeaderBuf = (buf) => {
  const headerBuf = buf.subarray(0, 12)
  const id = headerBuf.readUInt16BE(0)
  const flags = readflags(headerBuf.readUInt16BE(2))

  const qdcount = headerBuf.readUint16BE(4)
  const ancount = headerBuf.readUint16BE(6)
  const nscount = headerBuf.readUint16BE(8)
  const arcount = headerBuf.readUint16BE(10)

  return {id, ...flags, qdcount, ancount, nscount, arcount}
}


const createQuestionBuf = ({ name, type, cls }) => {
  const nameBuf = encodeName(name);
  const questionBuf = Buffer.alloc(nameBuf.length + 2 + 2);

  // copy name buffer into the start of question buffer
  nameBuf.copy(questionBuf);

  questionBuf.writeUInt16BE(type, nameBuf.length);
  questionBuf.writeUInt16BE(cls, nameBuf.length + 2);

  return questionBuf;
};

/**
 * @param {*} length since rdata is of variable length,
 * we need a length property to specify the length of the rdata
 *
 * @param {*} rdata Variable length data specific to the record type
 * (for an A record, its the IPv4 address).
 */
const createAnswerBuf = ({ name, type, cls, ttl, length, rdata }) => {
  const nameBuf = encodeName(name);
  const ansBuf = Buffer.alloc(nameBuf.length + 2 + 2 + 4 + 2 + 4);

  nameBuf.copy(ansBuf);

  ansBuf.writeUInt16BE(type, nameBuf.length);
  ansBuf.writeUInt16BE(cls, nameBuf.length + 2);
  ansBuf.writeUInt16BE(ttl, nameBuf.length + 2 + 2);
  ansBuf.writeUInt16BE(length, nameBuf.length + 2 + 2 + 4);

  // only expecting A records.
  // hence, rdata is a IPv4 address.
  const rdataBuf = encodeIPv4(rdata);
  rdataBuf.copy(ansBuf, nameBuf.length + 2 + 2 + 4 + 2);
  return ansBuf;
};

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

module.exports = { createHeaderBuf, createQuestionBuf, createAnswerBuf, readHeaderBuf };
