let net = require("net");
let fs = require("fs");
let open = require("open");
let ITPpacket = require("./ITPRequest");

// Enter your code for the client functionality here

//get input parameters from cmd line
let sF = process.argv.indexOf('-s') + 1,
    qF = process.argv.indexOf('-q') + 1,
    vF = process.argv.indexOf('-v') + 1,
    ip = process.argv[sF].split(':')[0],
    port = process.argv[sF].split(':')[1],
    buff2;


const socket = net.Socket();
const imgname = process.argv[qF];
socket.connect(port, ip, function(){
  let requestPacket = ITPpacket;
  requestPacket.init(imgname, parseInt(process.argv[vF]));
  console.log('Connected to ImageDB server on: ' + ip +':'+ port)

  socket.write(requestPacket.getBytePacket());
  
  socket.on('data', function(data) {
    let ver = parseBitPacket(data, 0, 4);
    let resNum = parseBitPacket(data, 4, 8);
    let resType='';

    switch(resNum){
      case 0: 
        resType = "Query";
        break;
      case 1:
        resType = "Found";
        break;
      case 2:
        resType = "Not found";
        break;
      default:
        resType = "Busy";
        break;
    }

    let buff1 = Buffer.alloc(12);
    data.copy(buff1, 0, 0, 12);

    buff2 = Buffer.alloc(data.length - 12);//copy the buff2 to a new buffer
    data.copy(buff2, 0, 12, data.length);
      
    let seqNum = parseBitPacket(data, 12, 20);
    let timeStamp = twosToNormal(data, 32, 32);
    let imgSize = parseBitPacket(data, 64, 32);
    imgData = parseBitPacket(data, 96, imgSize*8);

    console.log('\nITP packet header received:');
    printPacketBit(buff1);
    console.log(`\nServer sent:\n    --ITP Version = ${ver}\n    --Response Type = ${resType}\n    --Sequence Number = ${seqNum}\n    --Timestamp = ${timeStamp}\n`);

    if(resType === 'Not found')
      console.log(`${imgname} was not found`);
    
  })

  socket.on('end', function(){
    if(buff2.length > 0) {
      fs.writeFileSync(imgname, buff2);
      (async () => {
          await open(imgname, { wait: true });
          process.exit(1);
      })();
    }
    socket.end();
  })

  socket.on("close", function () {
    console.log("Disconnected from the server");
    console.log("Connection closed");
    if(buff2.length <= 0) process.exit(0);
  });
})

function twosToNormal(packet, offset, length){
  var num = parseBitPacket(packet, offset, length);
  if(num < 0){
    num = num.toString(2)
    var n = num.length;
    var i;
    for (i = n - 1; i >= 0; i--)
        if (num.charAt(i) == '1')
            break;

    if (i == -1)
        return "1" + num;

    for (k = i - 1; k >= 0; k--) {
        if (num.charAt(k) == '1')
            num = num.substring(0,k)+"0"+num.substring(k+1, num.length);
        else
            num = num.substring(0,k)+"1"+num.substring(k+1, num.length);
    }
  }
  return num;
}
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


  
