# Toy Dns Server

This is a toy dns server I built to learn how a dns server works under the hood, how to read UDP packets, what is recursive resolve, etc.

[Demo](./assets/demo.gif)

## Usage

To run this project, first you need to clone the project and then install the required dependencies.

```
git clone https://github.com/samyabrata-maji/toy-dns-server

pnpm install
```

Once that is done, you can use the `dns.sh` file to resolve domains.

```bash
chmod +x ./dns.sh
```

```bash
./dns.sh www.google.com
```