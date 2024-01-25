import dgram from "node:dgram";
import { createHeaderBuf, readHeaderBuf, } from "./buf.js";
import BufferReader from "./buffer-reader.js";
const log = (msg) => () => console.log(msg);
// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const udpSocket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1", log(">> Bind complete"));
// rinfo is the remote info
// containing information about the server
// that sent the message, like its address and port
udpSocket.on("message", (msg, rinfo) => {
    try {
        const reader = new BufferReader(msg);
        const parsedMsgHeader = readHeaderBuf(reader);
        // for (let i=0; i<parsedMsgHeader.aa)
        // let parsedMsgQuestion: QuestionParams[] = readQuestionBuf(reader);
        // const parsedMsgAnswer = readAnswerBuf(reader);
        console.log(">> UDP packet recieved!");
        console.log("--- Header Section ---");
        console.log(parsedMsgHeader);
        // console.log("--- Question Section ---");
        // console.log(parsedMsgQuestion);
        // console.log("--- Answer Section ---");
        // console.log(parsedMsgAnswer);
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
        // const questionBuf = createQuestionBuf({
        //   name: parsedMsgQuestion.name,
        //   type: 1,
        //   cls: 1,
        // });
        // const ansBuf = createAnswerBuf({
        //   name: parsedMsgQuestion.name,
        //   type: 1,
        //   cls: 1,
        //   ttl: 60,
        //   length: 4,
        //   rdata: "8.8.8.8",
        // });
        const response = Buffer.concat([headerBuf]);
        udpSocket.send(response, rinfo.port, rinfo.address, log(">> UDP packet sent!"));
    }
    catch (e) {
        log(`>> Error receiving data: ${e}`)();
    }
});
udpSocket.on("error", (err) => {
    console.log(`>> Error with server: ${err}`);
});
udpSocket.on("listening", () => {
    const addr = udpSocket.address();
    console.log(`>> Server running on ${addr.address}:${addr.port}`);
});
udpSocket.on("close", () => {
    console.log(">> Connection closed");
});
