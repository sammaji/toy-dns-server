const {
  encodeName,
  encodeIPv4,
  decodeName,
  decodeIPv4,
  readflags,
} = require("./utils");

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
  const id = buf.readUInt16BE(0);
  const flags = readflags(buf.readUInt16BE(2));

  const qdcount = buf.readUint16BE(4);
  const ancount = buf.readUint16BE(6);
  const nscount = buf.readUint16BE(8);
  const arcount = buf.readUint16BE(10);

  return { id, ...flags, qdcount, ancount, nscount, arcount };
};

const createQuestionBuf = ({ name, type, cls }) => {
  const nameBuf = encodeName(name);
  const questionBuf = Buffer.alloc(nameBuf.length + 2 + 2);

  // copy name buffer into the start of question buffer
  nameBuf.copy(questionBuf);

  questionBuf.writeUInt16BE(type, nameBuf.length);
  questionBuf.writeUInt16BE(cls, nameBuf.length + 2);

  return questionBuf;
};

const readQuestionBuffer = (buf, start = 12) => {
  const name = decodeName(buf, start);
  const type = buf.readUInt16BE(start + name.length + 2);
  const cls = buf.readUInt16BE(start + name.length + 4);
  return { name, type, cls };
};

const readAnswerBuffer = (buf, start) => {
  const name = decodeName(buf, start);
  return { name };
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

module.exports = {
  createHeaderBuf,
  createQuestionBuf,
  createAnswerBuf,
  readHeaderBuf,
  readQuestionBuffer,
  readAnswerBuffer,
};
