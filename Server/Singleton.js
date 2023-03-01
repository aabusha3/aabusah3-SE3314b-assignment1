// Some code need to be added here, that are common for the module
let timeStamp = 0;  //our timer value
let seqNum = 0;    //the sequence number

module.exports = {
    init: function() {
        timeStamp = Math.ceil(Math.random()*999);
        seqNum = Math.floor(Math.random()*Math.pow(2, 20));
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function() {
        seqNum = seqNum >= Math.pow(2, 20)? Math.floor(Math.random()*Math.pow(2, 20)) : seqNum;
        return seqNum++;
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function() {
        timeStamp = timeStamp >= Math.pow(2, 32)? Math.ceil(Math.random()*999) : timeStamp;
        return timeStamp;
    }
};


setInterval(tick, 10);  //check the timer every 10s

function tick(){    //tick the timer
    if ((timeStamp >= (Math.pow(2, 32) - 1)) || (timeStamp < 0))
        timeStamp = Math.ceil(Math.random()*999);
    timeStamp++;    
}