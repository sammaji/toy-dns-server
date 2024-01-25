/**
 * Domain name is split into labels, eg in google.com, there are two labels: google, com.
 *
 * For each label, we first append size of the buffer followed by content, then null byte.
 * eg, google becomes \x06google\x00.
 */
export const encodeName = (name) => {
    const labels = name.split(".");
    const nameBuf = Buffer.alloc(name.length + 2);
    let offset = 0;
    labels.forEach((label) => {
        if (!label)
            return;
        nameBuf.writeUInt8(label.length, offset++);
        nameBuf.write(label, offset);
        offset += label.length;
    });
    return nameBuf;
};
export const decodeName = (reader) => {
    let pos = reader.position;
    let jumped = false;
    let max_jumps = 5;
    let jumps_performed = 0;
    let delim = "";
    let outstr = "";
    while (true) {
        if (jumps_performed > max_jumps) {
            throw new Error(`Limit of ${max_jumps} jumps exceeded.`);
        }
        let len = reader.get(pos);
        if ((len & 0xC0) == 0xC0) {
            if (!jumped) {
                reader.seek(pos + 2);
            }
            let b2 = reader.get(pos + 1);
            let offset = ((len ^ 0xC0) << 8) | b2;
            console.log(offset);
            pos = offset;
            jumped = true;
            jumps_performed++;
        }
        else {
            pos++;
            if (len == 0) {
                break;
            }
            const s = reader.buffer.toString("utf8", pos, pos + len);
            outstr += delim + s;
            delim = ".";
            pos += len;
        }
    }
    if (!jumped) {
        reader.seek(pos);
    }
    return outstr;
};
export const encodeIPv4 = (addr) => {
    const seg = addr.split(".");
    const ipBuf = Buffer.alloc(4);
    let offset = 0;
    seg.forEach((x) => ipBuf.writeUInt8(parseInt(x), offset++));
    return ipBuf;
};
export const decodeIPv4 = (reader) => {
    let seg = [];
    for (let i = 0; i < 4; i++)
        seg.push(reader.readUInt8());
    return seg.join(".");
};
export const readflags = (flags) => {
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
