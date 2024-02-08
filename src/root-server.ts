/**
 * 13 root servers of the internet
 * source: https://www.internic.net/domain/named.root
 */
const rootServers: DnsRecord[] = [
  {
    name: "a.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "198.41.0.4",
  },
  {
    name: "b.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "170.247.170.2",
  },
  {
    name: "c.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "192.33.4.12",
  },
  {
    name: "d.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "199.7.91.13",
  },
  {
    name: "e.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "192.203.230.10",
  },
  {
    name: "f.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "192.5.5.241",
  },
  {
    name: "g.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "192.112.36.4",
  },
  {
    name: "h.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "198.97.190.53",
  },
  {
    name: "i.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "192.36.148.17",
  },
  {
    name: "j.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "192.58.128.30",
  },
  {
    name: "k.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "193.0.14.129",
  },
  {
    name: "l.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "199.7.83.42",
  },
  {
    name: "m.root-servers.net",
    ttl: 3600000,
    type: 1,
    cls: 1,
    length: 4,
    rdata: "202.12.27.33",
  },
];

/**
 * @returns IPv4 address of one of the 13 root servers of the internet.
 */
export const getRandomRootServer = () => {
  const rand = Math.floor(Math.random() * (rootServers.length - 1)) + 1;
  return rootServers[rand];
};
