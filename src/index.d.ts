const enum ResultCode {
  NOERROR = 0,
  FORMERR = 1,
  SERVFAIL = 2,
  NXDOMAIN = 3,
  NOTIMP = 4,
  REFUSED = 5,
}

const enum RecordType {
  UNKNOWN,
  A = 1,
  NS = 2,
  CNAME = 5,
  MX = 15,
  AAAA = 28,
}

let recordTypeTable: Record<RecordType, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  15: "MX",
  28: "AAAA",
};

type DnsHeaderFlagParams = {
  /** RecordType/Response Indicator (QR) (1 bit) - 1 for a reply packet, 0 for a question packet. */
  qr: number;

  opcode: number;

  /** Authoritative Answer (1 bit) - 1 if the responding server "owns" the domain queried, i.e., it's authoritative. */
  aa: number;

  /** Truncation (1 bit) - 1 if the message is larger than 512 bytes. Always 0 in UDP responses. */
  tc: number;

  /** Recursion Desired (1 bit) - Sender sets this to 1 if the server should recursively resolve this query, 0 otherwise. */
  rd: number;

  /** Recursion Available (1 bit) - Server sets this to 1 to indicate that recursion is available. */
  ra: number;

  z: number;
  rcode: ResultCode;
};

type DnsHeader = DnsHeaderFlagParams & {
  id: number;

  /** Question Count (16 bits) - Number of questions in the Question section. */
  qdcount: number;

  /** Answer Record Count (16 bits) - Number of records in the Answer section. */
  ancount: number;

  /** Authority Record Count (16 bits) - Number of records in the Authority section. */
  nscount: number;

  /** Additional Record Count (16 bits) - Number of records in the Additional section. */
  arcount: number;
};

type DnsQuestionRecord = { name: string; type: RecordType; cls: number };

type ResponsePreamble = { name: string; cls: number; ttl: number };

type DnsRecord = DnsQuestionRecord & {
  ttl: number;
  length: number;
  rdata: string;
};

type DnsRecordWithTypes = ResponsePreamble &
  (
    | {
        type: RecordType.A;
        ipv4: string;
      }
    | { type: RecordType.AAAA; ipv6: string }
    | {
        type: RecordType.NS | RecordType.CNAME | RecordType.MX;
        name: string;
      }
    | {
        type: RecordType.UNKNOWN;
        length: number;
        rdata: string;
      }
  );

type AnswerParams = DnsRecord;
type AuthorityParams = DnsRecord;
type AdditionalParams = DnsRecord;

type DnsPacket = {
  header: DnsHeader;
  qn: DnsQuestionRecord[];
  ans: AnswerParams[];
  authority: AuthorityParams[];
  additional: AdditionalParams[];
};
