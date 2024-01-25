enum ResulCode {
  NOERROR = 0,
  FORMERR = 1,
  SERVFAIL = 2,
  NXDOMAIN = 3,
  NOTIMP = 4,
  REFUSED = 5,
}

enum Query {
  UNKNOWN,
  A = 1,
}

type HeaderFlagParams = {
  qr: number;
  opcode: number;
  aa: number;
  tc: number;
  rd: number;
  ra: number;
  z: number;
  rcode: ResulCode;
};

type HeaderParams = HeaderFlagParams & {
  id: number;
  qdcount: number;
  ancount: number;
  nscount: number;
  arcount: number;
};

type QuestionParams = { name: string; type: number; cls: number };

type ResponseParams = QuestionParams & {
  ttl: number;
  length: number;
  rdata: string;
};

type AnswerParams = ResponseParams
type AuthorityParams = ResponseParams
type AdditionalParams = ResponseParams