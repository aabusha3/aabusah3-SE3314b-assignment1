let timeStamp = 0;  //our timer value
let seqNum = 0;    //the sequence number

module.exports = {
    //--------------------------
    //init: generate random time and sequence number
    //--------------------------
    init: function() {
        timeStamp = Math.ceil(Math.random()*999);
        seqNum = Math.floor(Math.random()*Math.pow(2, 20));
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number then add 1
    //--------------------------
    getSequenceNumber: function() {
        seqNum = seqNum >= Math.pow(2, 20)? Math.floor(Math.random()*Math.pow(2, 20)) : seqNum;//reset sequnece number when reach 2^20
        return seqNum++;
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function() {
        timeStamp = timeStamp >= Math.pow(2, 32)? Math.ceil(Math.random()*999) : timeStamp;//reset time when reach 2^32
        return timeStamp;
    }
};


setInterval(tick, 10);  //call tick every 10s

function tick(){    //tick the timer
    if ((timeStamp >= (Math.pow(2, 32) - 1)) || (timeStamp < 0))//reset time when reach 2^32
        timeStamp = Math.ceil(Math.random()*999);
    timeStamp++;//increase time
}