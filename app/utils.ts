import BufferReader from "./buffer-reader.js";

/**
 * Domain name is split into labels, eg in google.com, there are two labels: google, com.
 *
 * For each label, we first append size of the buffer followed by content, then null byte.
 * eg, google becomes \x06google\x00.
 */
export const encodeName = (name: string) => {
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

export const decodeName = (reader: BufferReader) => {
  let labels: string[] = [];
  while (reader.length() > 0) {
    const length = reader.readUInt8();

    // if we encounter a null byte, we terminate
    if (length === 0) break;

    // if there is a jump directive
    if ((length & 0xc0) === 0xc0) {
      let b2 = reader.get(reader.position + 1)
      let offset = ((length ^ 0xC0) << 8) | b2
      reader.seek(offset)
      continue
    }

    labels.push(reader.readStrN(length));
  }

  return labels.join(".");
};

export const encodeIPv4 = (addr: string) => {
  const seg = addr.split(".");
  const ipBuf = Buffer.alloc(4);

  let offset = 0;
  seg.forEach((x) => ipBuf.writeUInt8(parseInt(x), offset++));
  return ipBuf;
};

export const decodeIPv4 = (reader: BufferReader) => {
  let seg = [];
  for (let i = 0; i < 4; i++) seg.push(reader.readUInt8());
  return seg.join(".");
};

export const readflags = (flags: number): HeaderFlagParams => {
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
