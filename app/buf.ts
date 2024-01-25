import BufferReader from "./buffer-reader.js";
import {
  decodeIPv4,
  decodeName,
  encodeIPv4,
  encodeName,
  readflags,
} from "./utils.js";

export const createHeaderBuf = ({
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
}: HeaderParams) => {
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

export const readHeaderBuf = (reader: BufferReader) => {
  const id = reader.readUInt16BE();
  const flags = readflags(reader.readUInt16BE());

  const qdcount = reader.readUInt16BE();
  const ancount = reader.readUInt16BE();
  const nscount = reader.readUInt16BE();
  const arcount = reader.readUInt16BE();

  return { id, ...flags, qdcount, ancount, nscount, arcount };
};

export const createQuestionBuf = ({ name, type, cls }: QuestionParams) => {
  const nameBuf = encodeName(name);
  const questionBuf = Buffer.alloc(nameBuf.length + 2 + 2);

  // copy name buffer into the start of question buffer
  nameBuf.copy(questionBuf);

  questionBuf.writeUInt16BE(type, nameBuf.length);
  questionBuf.writeUInt16BE(cls, nameBuf.length + 2);

  return questionBuf;
};

export const readQuestionBuf = (reader: BufferReader): QuestionParams => {
  const name = decodeName(reader);
  const type = reader.readUInt16BE();
  const cls = reader.readUInt16BE();
  return { name, type, cls };
};

export const readAnswerBuf = (reader: BufferReader): AnswerParams => {
  const query = readQuestionBuf(reader);

  // time-to-live (ttl) is *signed* 4 byte integer
  const ttl = reader.buffer.readInt32BE(reader.position);
  reader.skip(4)

  const length = reader.readUInt16BE();
  const rdata = decodeIPv4(reader);
  return { ...query, ttl, length, rdata };
};

/**
 * @param {*} length since rdata is of variable length,
 * we need a length property to specify the length of the rdata
 *
 * @param {*} rdata Variable length data specific to the record type
 * (for an A record, its the IPv4 address).
 */
export const createAnswerBuf = ({
  name,
  type,
  cls,
  ttl,
  length,
  rdata,
}: AnswerParams) => {
  const nameBuf = encodeName(name);
  const ansBuf = Buffer.alloc(nameBuf.length + 2 + 2 + 4 + 2 + 4);

  nameBuf.copy(ansBuf);

  ansBuf.writeUInt16BE(type, nameBuf.length);
  ansBuf.writeUInt16BE(cls, nameBuf.length + 2);
  
  // ttl is *signed* 32 byte int
  ansBuf.writeInt32BE(ttl, nameBuf.length + 2 + 2);
  
  ansBuf.writeUInt16BE(length, nameBuf.length + 2 + 2 + 4);

  // only expecting A records.
  // hence, rdata is a IPv4 address.
  const rdataBuf = encodeIPv4(rdata);
  rdataBuf.copy(ansBuf, nameBuf.length + 2 + 2 + 4 + 2);
  return ansBuf;
};
