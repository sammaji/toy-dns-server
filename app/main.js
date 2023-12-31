const dgram = require("dgram");
const { createHeaderBuf, createQuestionBuf, createAnswerBuf } = require("./buf");

const log = (msg) => () => console.log(msg);

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const udpSocket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1", log(">> bind complete"));

// rinfo is the remote info
// containing information about the server
// that sent the message, like its address and port
udpSocket.on("message", (msg, rinfo) => {
  try {
    console.log(">> UDP packet recieved!");
    console.log(msg.toString());

    const headerBuf = createHeaderBuf({
      id: 1234,
      qr: 1,
      opcode: 0,
      aa: 0,
      tc: 0,
      rd: 0,
      ra: 0,
      z: 0,
      rcode: 0,
      qdcount: 1,
      ancount: 1,
      nscount: 0,
      arcount: 0,
    });

    const questionBuf = createQuestionBuf({name: "codecrafters.io", type: 1, cls: 1})
    const ansBuf = createAnswerBuf({name: "codecrafters.io", type: 1, cls: 1, ttl: 60, length: 4, rdata: "8.8.8.8"})

    const response = Buffer.concat([headerBuf, questionBuf, ansBuf])

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
  console.log(`>> Error with server: ${err}`);
});

udpSocket.on("listening", () => {
  const addr = udpSocket.address();
  console.log(`>> Server running on ${addr.address}:${addr.port}`);
});

udpSocket.on("close", () => {
  console.log(">> Connection closed");
});
