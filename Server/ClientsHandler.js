let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');

// You may need to add some delectation here


module.exports = {
    handleClientJoining: function (sock) {
        sock.on('data',function(data){
            let buff1 = Buffer.alloc(12);
            data.copy(buff1, 0, 0, 12);

            let ver = parseBitPacket(data, 0, 4);

            let buff2 = Buffer.alloc(data.length - 12);//copy the payload to a new buffer
            data.copy(buff2, 0, 12, data.length);
            let name = bytesToString(buff2)

            let extNum = parseBitPacket(data, 64, 4);
            let ext = '';
            switch(extNum){
                case 1:
                    ext = 'bmp';
                    break;
                case 2:
                    ext = 'jpeg';
                    break;
                case 3:
                    ext = 'gif';
                    break;
                case 4:
                    ext = 'png';
                    break;
                case 5:
                    ext = 'tiff';
                    break;
                default:
                    ext = 'raw';
                    break;
            }

            let seqNum = singleton.getSequenceNumber();
            let timeStamp = singleton.getTimestamp();
            
            console.log(`\nClient-${seqNum} is connected at timestamp: ${timeStamp}\n`);
            console.log('ITP packet received:');
            printPacketBit(buff1);
            printPacketBit(buff2);
            console.log(`\nClient-${seqNum} requests:\n    --ITP Version: ${ver}\n    --Timestamp: ${timeStamp}\n    --Request Type: Query\n    --Image file exension(s): ${ext}\n    --Image file name: ${name}`);
           
            let responsePacket = ITPpacket;
            responsePacket.init(name, ext, seqNum, timeStamp, ver)
            sock.write(responsePacket.getPacket())
 
            sock.end();
            console.log(`\nClient-${seqNum} closed the connection`);
        })
    }
};

//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

// Returns the integer value of the extracted bits fragment for a given packet
function parseBitPacket(packet, offset, length) {
    let number = "";
    for (var i = 0; i < length; i++) {
        // let us get the actual byte position of the offset
        let bytePosition = Math.floor((offset + i) / 8);
        let bitPosition = 7 - ((offset + i) % 8);
        let bit = (packet[bytePosition] >> bitPosition) % 2;
        number = (number << 1) | bit;
    }
    return number;
}

// Prints the entire packet in bits format
function printPacketBit(packet) {
    var bitString = "";

    for (var i = 0; i < packet.length; i++) {
        // To add leading zeros
        var b = "00000000" + packet[i].toString(2);
        // To print 4 bytes per line
        if (i > 0 && i % 4 == 0) bitString += "\n";
        bitString += " " + b.substr(b.length - 8);
    }
    console.log(bitString);
}

// Converts byte array to string
function bytesToString(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}