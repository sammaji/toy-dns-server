import dgram from "dgram";
import {
  createHeaderBuf,
  createQuestionBuf,
  readRecord,
  readHeaderBuf,
  readQuestionBuf,
} from "./buf.js";
import BufferReader from "./buffer-reader.js";

const socket = dgram.createSocket("udp4");

socket.bind();

socket.on("message", (msg, rinfo) => {
  console.log(msg);

  const reader = new BufferReader(msg);
  const header = readHeaderBuf(reader);

  let qn: DnsQuestionRecord[] = [];
  for (let i = 0; i < header.qdcount; i++) {
    qn.push(readQuestionBuf(reader));
  }

  let ans: AnswerParams[] = [];
  for (let i = 0; i < header.ancount; i++) {
    ans.push(readRecord(reader));
  }

  let authority: AuthorityParams[] = [];
  console.log(">>>>>>>>>>>> " + header.nscount);
  for (let i = 0; i < header.nscount; i++) {
    authority.push(readRecord(reader));
  }

  let ad: AdditionalParams[] = [];
  for (let i = 0; i < header.arcount; i++) {
    ad.push(readRecord(reader));
  }

  console.log(">> UDP packet recieved!");
  console.log(header);
  console.table(qn);
  console.table(ans);
  console.table(authority);
  console.table(ad);

  socket.close();
});

const hb = createHeaderBuf({
  id: 223,

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
const qb = createQuestionBuf({ name: "www.google.com", type: 1, cls: 1 });

const buf = Buffer.concat([hb, qb]);

socket.send(buf, 0, buf.length, 53, "198.41.0.4", (err) => {
  console.log(err && err);
});
