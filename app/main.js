const dgram = require("dgram");

const log = (msg) => () => console.log(msg)

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const udpSocket = dgram.createSocket("udp4");
udpSocket.bind(2053, '127.0.0.1', log(">> bind complete"))


// rinfo is the remote info 
// containing information about the server
// that sent the message, like its address and port
udpSocket.on("message", (msg, rinfo) => {
    try {
        const response = Buffer.from("")
        console.log(">> UDP packet recieved!")
        console.log(msg.toString())
        udpSocket.send(response, rinfo.port, rinfo.address, log(">> UDP packet sent!"))
    } catch (e) {
        log(`>> Error receiving data: ${e}`)()
    }
})

udpSocket.on("error", (err) => {
    console.log(`>> Error with server: ${err}`)
})

udpSocket.on("listening", () => {
    const addr = udpSocket.address()
    console.log(`>> Server running on ${addr.address}:${addr.port}`)
})

udpSocket.on("close", () => {
    console.log(">> Connection closed")
})
