import dgram from "dgram";
import { createHeaderBuf, createQuestionBuf, readPacket } from "./buffer.js";
import BufferReader from "./buffer-reader.js";
import { getRandomRootServer } from "./root-server.js";

const socket = dgram.createSocket("udp4");
socket.bind();

const handleError = (err: Error | null) => {
  if (err) {
    console.log(err);
    socket.close();
  }
};

function recursiveResolve(packet: DnsPacket) {
  if (packet.ans.length > 0) {
    return packet.ans;
  }

  const rec = [...packet.authority, ...packet.additional].filter(
    (v) => v.type === 1,
  );

  const rand = Math.floor(Math.random() * (rec.length - 1)) + 1;
  if (rec.length > 0) {
    socket.send(buffer, 0, buffer.length, 53, rec[rand].rdata, handleError);
  } else throw Error("Cannot locate given domain");
}

const MAX_ATTEMPTS = 10;
let attemps = 0;
socket.on("message", (msg) => {
  const reader = new BufferReader(msg);
  const packet = readPacket(reader);
  const data = recursiveResolve(packet);
  attemps++;

  if (data) {
    console.table(data);
    socket.close();
  }

  if (attemps > MAX_ATTEMPTS) {
    throw new Error("Maximum recursion limit exceeded.");
  }
});

const arg = process.argv[2];
let domain = /(https:\/\/)?((?:[\w-]*\.)+[\w-]*)(\/)?(.*)/.exec(arg)?.at(2); 
if (!domain) throw new Error(`Invalid domain: ${arg}`)


const header = createHeaderBuf({
  id: Math.floor(Math.random() * 100) + 1,

  qr: 0,
  opcode: 0,
  aa: 0,
  tc: 0,
  rd: 1,
  ra: 0,
  z: 0,
  rcode: 0,

  qdcount: 1,
  ancount: 0,
  arcount: 0,
  nscount: 0,
});
const question = createQuestionBuf({ name: domain, type: 1, cls: 1 });
const buffer = Buffer.concat([header, question]);
socket.send(
  buffer,
  0,
  buffer.length,
  53,
  getRandomRootServer().rdata,
  handleError,
);
