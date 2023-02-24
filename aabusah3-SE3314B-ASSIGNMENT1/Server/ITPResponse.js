// You may need to add some delectation here
var fs = require('fs');
var imgs = fs.readdirSync('./images');
let packet_send;
module.exports = {

    init: function (name, ext, seqNum, timeStamp, ver) { 
        // let packet = new Buffer.allocUnsafe(12);
        
        // let Name = '';
        // for (let i = 0; i < name.length - 1; i++){    //for some reason an extra char is added to my string
        //     Name += name.charAt(i);
        // }
        // console.log(':'+Name+':')
        // console.log(':'+name+':')
        let fileName = `${name}.${ext}`

        let imgLoc = `./images/${fileName}`;
        let imgData;
        let imgSize = 0;
        let found = false;

        for (let i = 0; i < imgs.length; i++){
            if (fileName == imgs[i]){
                found = true;
                
                imgData = fs.readFileSync(imgLoc);
                imgSize = fs.statSync(imgLoc).size
            }
        }
        let header = new Buffer.allocUnsafe(12);
        storeBitPacket(header, ver, 0, 4);

        if (found) storeBitPacket(header, 1, 4, 8);//store response type = 1
        else storeBitPacket(header, 2, 4, 8);    //store response type = 2
        
        storeBitPacket(header, seqNum, 12, 20);
        storeBitPacket(header, timeStamp, 32, 32);
        storeBitPacket(header, imgSize, 64, 32);


        let payload = new Buffer.alloc(imgData.length + 4);
        for (i = 0; i < imgData.length; i++) 
            payload[i] = imgData[i];
        
        let packet = new Buffer.alloc(payload.length + header.length);
        for (let h = 0; h < header.length; h++)
            packet[h] = header[h];
        for (let p = 0; p < payload.length; p++)
            packet[p + header.length] = payload[p];
            
    
        packet_send = packet;
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function () {
        // enter your code here
        return packet_send;
    }
};

//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

// Store integer value into specific bit poistion the packet
function storeBitPacket(packet, value, offset, length) {
    // let us get the actual byte position of the offset
    let lastBitPosition = offset + length - 1;
    let number = value.toString(2);
    let j = number.length - 1;
    for (var i = 0; i < number.length; i++) {
        let bytePosition = Math.floor(lastBitPosition / 8);
        let bitPosition = 7 - (lastBitPosition % 8);
        if (number.charAt(j--) == "0") {
            packet[bytePosition] &= ~(1 << bitPosition);
        } else {
            packet[bytePosition] |= 1 << bitPosition;
        }
        lastBitPosition--;
    }
}