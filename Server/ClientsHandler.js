let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');

module.exports = {
    handleClientJoining: function (sock) {
        sock.on('data',function(data){//on request recieve
            let header = Buffer.alloc(12);//create 12 byte space for header
            data.copy(header, 0, 0, 12);//copy first 12 bytes into header

            let ver = parseBitPacket(data, 0, 4);//get version
            let reqType = parseBitPacket(data, 24, 8);//get request type

            if(ver !== 7 || reqType !== 0) {
                if(ver !== 7) console.log('Wrong Version Number, Request Ignored');//print error message
                if(reqType !== 0) console.log('Wrong Request Type, Request Ignored');//print error message
                return sock.end();//end socket connection
            }

            let payload = Buffer.alloc(data.length - 12);//create space for request payload with the image's size
            data.copy(payload, 0, 12, data.length);//copy image name into payload
            let name = bytesToString(payload);//get the image name from payload

            let extNum = parseBitPacket(data, 64, 4);//get extension number
            let ext = '';
            switch(extNum){//convert extension number to a usable extension
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

            let seqNum = singleton.getSequenceNumber();//get sequence number
            let timeStamp = singleton.getTimestamp();//get time
            
            //print request info in correct format
            console.log(`\nClient-${seqNum} is connected at timestamp: ${timeStamp}\n`);
            console.log('ITP packet received:');
            printPacketBit(header);
            printPacketBit(payload);
            console.log(`\nClient-${seqNum} requests:\n    --ITP Version: ${ver}\n    --Timestamp: ${timeStamp}\n    --Request Type: Query\n    --Image file exension(s): ${ext}\n    --Image file name: ${name}`);
           
            let responsePacket = ITPpacket;
            responsePacket.init(name+'.'+ext, seqNum, timeStamp, ver);//fill response pacjet
            sock.write(responsePacket.getPacket());//write response to client
 
            sock.end();//end socket connection
            console.log(`\nClient-${seqNum} closed the connection`);//print goodbye message
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