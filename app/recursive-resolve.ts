import dgram from "dgram";
import {
  createHeaderBuf,
  createQuestionBuf,
  readRecord,
  readHeaderBuf,
  readQuestionBuf,
  readPacket,
} from "./buf.js";
import BufferReader from "./buffer-reader.js";
import rootServers from "./root-server.js";

const domain = "youtube.com";

const socket = dgram.createSocket("udp4");

socket.bind();

function recursiveResolve(packet: DnsPacket) {
    if (packet.ans.length > 0) {return packet.ans}

    const rec = packet.additional.filter(v => v.type === 1)
    
    if (rec.length <= 0) throw Error("Cannot locate given domain")
    
    socket.send(buf, 0, buf.length, 53, rec[0].rdata, logError)
}

socket.on("message", (msg) => {
  const reader = new BufferReader(msg);
  const packet = readPacket(reader)

  console.log("packet recieved")

  const data = recursiveResolve(packet);

  if (data) {
    console.table(data)
    socket.close()
  }

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
const qb = createQuestionBuf({ name: domain, type: 1, cls: 1 });

const buf = Buffer.concat([hb, qb]);

const logError = (err: Error | null) => {
    if (err) {console.log(err)}
}

socket.send(buf, 0, buf.length, 53, rootServers[0].rdata, logError);

// socket.send(buf, 0, buf.length, 53, "198.41.0.4", (err) => {
//     console.log(err && err)
// })
