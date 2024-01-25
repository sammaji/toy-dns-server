"use strict";
// import {
//   createAnswerBuf,
//   createHeaderBuf,
//   createQuestionBuf,
//   readAnswerBuf,
//   readHeaderBuf,
//   readQuestionBuf,
// } from "./buf.js";
// import BufferReader from "./buffer-reader.js";
// import { decodeName } from "./utils.js";
// const headerBuf = createHeaderBuf({
//   id: 123,
//   qr: 1,
//   opcode: 1,
//   aa: 0,
//   tc: 0,
//   rd: 1,
//   ra: 1,
//   z: 0,
//   rcode: 0,
//   qdcount: 1,
//   ancount: 1,
//   nscount: 0,
//   arcount: 0,
// });
// const questionBuf = createQuestionBuf({
//   name: "google.com",
//   type: 1,
//   cls: 1,
// });
// const ansBuf = createAnswerBuf({
//   name: "google.com",
//   type: 1,
//   cls: 1,
//   ttl: 60,
//   length: 4,
//   rdata: "8.8.8.8",
// });
// const response = Buffer.concat([headerBuf, questionBuf, ansBuf]);
// const reader = new BufferReader(response);
// console.log(readHeaderBuf(reader));
// console.log("---------------------------------");
// const pm = readQuestionBuf(reader);
// console.log(pm);
// console.log("---------------------------------");
// console.log(readAnswerBuf(reader));
// // console.log(readAnswerBuf(response, 12 + 24 + 1 + 1));
