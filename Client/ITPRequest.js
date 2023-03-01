// You may need to add some delectation here
let bytePacket;
let timeStamp = Math.ceil(Math.random()*999);

module.exports = {
  init: function (query, version) {
    //need packet to be dynamic size, needs to fit all the bytes
    let name = query.split('.')[0];
    let ext = query.split('.')[1];

    let packet = new Buffer.alloc(12 + name.split('').length);

    let IT ='';
    switch(ext){  //determine the image file ext in bits
      case'bmp': case 'BMP':
        IT = 1;
        break;
      case'jpeg': case'JPEG':
        IT = 2;
        break;
      case'GIF':case'gif':
        IT =3;
        break;
      case'png':case'PNG':
        IT = 4;
        break;
      case'tiff':case'TIFF':
        IT = 5;
        break;
      default:
        IT = 15;
    }

    storeBitPacket(packet, version, 0, 4)
    storeBitPacket(packet, 0, 4, 28); //handle the query and reserved slots, all 0s
    // storeBitPacket(packet, 0, 24, 8); 
    storeBitPacket(packet, timeStamp, 32, 32);
    storeBitPacket(packet, IT, 64, 4);
    storeBitPacket(packet, name.split('').length, 68, 28);

    for (let i = 0; i < name.split('').length; i++)
      storeBitPacket(packet, name.charCodeAt(i), 96+(8*i), 8);
    

    bytePacket = packet;
  },

  //--------------------------
  //getBytePacket: returns the entire packet in bytes
  //--------------------------
  getBytePacket: function () {
    // enter your code here
    return bytePacket;
  },
};

setInterval(tick, 10);  //check the timer every 10s
function tick(){    //tick the timer
    if ((timeStamp >= (Math.pow(2, 32) - 1)) || (timeStamp < 0))
      timeStamp = Math.ceil(Math.random()*999);
    timeStamp++; 
}

//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

// Convert a given string to byte array
function stringToBytes(str) {
  var ch,
    st,
    re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xff); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    } while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

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
