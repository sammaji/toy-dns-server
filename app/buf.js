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

const createQuestionBuf = ({ name, type, cls }) => {
  
  // encoding the name buffer
  // domain name is split into labels, eg in google.com, there are two labels: google, com
  // for each label, we first append size of the buffer followed by content, then null byte
  // eg, google becomes \x06google\x00
  const labels = name.split(".");
  const nameBuf = Buffer.alloc(name.length + 2);
  let offset = 0;
  labels.forEach((label) => {
    if (!label) return;

    nameBuf.writeUInt8(label.length, offset++);
    nameBuf.write(label, offset);
    offset += label.length;
  });
  
  const questionBuf = Buffer.alloc(nameBuf.length + 2 + 2);

  // copy name buffer into the start of question buffer
  nameBuf.copy(questionBuf)

  questionBuf.writeUInt16BE(type, nameBuf.length);
  questionBuf.writeUInt16BE(cls, nameBuf.length + 2);

  return questionBuf
};

module.exports = { createHeaderBuf, createQuestionBuf };
