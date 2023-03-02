var fs = require('fs');
var imgs = fs.readdirSync('./images'); //read all files in the images directory
let packet; //this is the packet that is sent at the end
module.exports = {
    //--------------------------
    //init: fills the response packet with the appropriate data
    //--------------------------
    init: function (fileName, seqNum, timeStamp, ver) { 
        let imgLoc = `./images/${fileName}`;//the location of the requested file
        let imgData = '';//the image itsefl in buffer array
        let imgSize = 0;//the images size
        let found = false;//flag trips if the request if found

        for (let i = 0; i < imgs.length; i++){//loop through all the images to find a match with the requested name 
            if (fileName == imgs[i]){//if found
                found = true;//trip found flag
                
                imgData = fs.readFileSync(imgLoc);//load image data
                imgSize = fs.statSync(imgLoc).size;//get the size of the image file from the image stat
            }
        }
        let header = new Buffer.alloc(12);//create 12 byte space for header 
        storeBitPacket(header, ver, 0, 4);//store version in the first 4 bits

        if (found) storeBitPacket(header, 1, 4, 8);//store response type = 1 for 'found' response
        else storeBitPacket(header, 2, 4, 8);    //store response type = 2 for 'not found' response
        
        storeBitPacket(header, seqNum, 12, 20);//store sequence number
        storeBitPacket(header, timeStamp, 32, 32);//store time
        storeBitPacket(header, imgSize, 64, 32);//store size
        
        packet = new Buffer.alloc(imgData.length + header.length);//create space for response packet
        for (let h = 0; h < header.length; h++)//push header into the response packet
            packet[h] = header[h];
        if (found) for (let p = 0; p < imgData.length; p++)//push payload into the response packet
            packet[p + header.length] = imgData[p];
    
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function () {
        return packet;//give response packet
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