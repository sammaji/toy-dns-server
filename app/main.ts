import dgram, { RemoteInfo } from "node:dgram";
import {
  createRecordBuf,
  createHeaderBuf,
  createQuestionBuf,
  readRecord,
  readHeaderBuf,
  readQuestionBuf,
} from "./buf.js";
import BufferReader from "./buffer-reader.js";
import { buffer } from "stream/consumers";

const log = (msg: string | object) => () => console.log(msg);

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const udpSocket = dgram.createSocket({ type: "udp4", reuseAddr: true });
udpSocket.bind(2053, "0.0.0.0", log(">> Bind complete"));

// rinfo is the remote info
// containing information about the server
// that sent the message, like its address and port
udpSocket.on("message", (msg: Buffer, rinfo: RemoteInfo) => {
  try {
    const reader = new BufferReader(msg);
    const parsedMsgHeader = readHeaderBuf(reader);

    let parsedMsgQuestion: DnsQuestionRecord[] = [];
    for (let i = 0; i < parsedMsgHeader.qdcount; i++) {
      parsedMsgQuestion.push(readQuestionBuf(reader));
    }

    // let parsedMsgAnswer: AnswerParams[] = []
    // for (let i=0; i<parsedMsgHeader.ancount; i++) {
    //   parsedMsgAnswer.push(readRecord(reader))
    // }

    console.log(">> UDP packet recieved!");
    console.log(parsedMsgHeader);
    console.table(parsedMsgQuestion);
    // console.table(parsedMsgAnswer)

    const headerBuf = createHeaderBuf({
      id: parsedMsgHeader.id,
      qr: 1,
      opcode: parsedMsgHeader.opcode,
      aa: 0,
      tc: 0,
      rd: parsedMsgHeader.rd,
      ra: 0,
      z: 0,
      rcode: parsedMsgHeader.opcode === 0 ? 0 : 4,
      qdcount: 1,
      ancount: 1,
      nscount: 0,
      arcount: 0,
    });

    const qnBuf = parsedMsgQuestion.map((question) =>
      createQuestionBuf(question),
    );

    const ansBuf = parsedMsgQuestion.map((question) => {
      return createRecordBuf({
        ...question,
        ttl: 60,
        length: 4,
        rdata: "8.8.8.8",
      });
    });

    const response = Buffer.concat([headerBuf, ...qnBuf, ...ansBuf]);

    udpSocket.send(
      response,
      rinfo.port,
      rinfo.address,
      log(">> UDP packet sent!"),
    );
  } catch (e) {
    log(`>> Error receiving data: ${e}`)();
  }
});

udpSocket.on("error", (err) => {
  console.log(err);
  console.log(`>> Error with server: ${err}`);
});

udpSocket.on("listening", () => {
  const addr = udpSocket.address();
  console.log(`>> Server running on ${addr.address}:${addr.port}`);
  udpSocket.send("google.com", 53, "1.1.1.1", (err, bytes) => {
    console.log(err ? err : bytes);
  });
});

udpSocket.on("close", () => {
  console.log(">> Connection closed");
});
