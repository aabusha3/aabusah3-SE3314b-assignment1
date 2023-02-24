// Some code need to be added here, that are common for the module
let timeStamp = 0;  //our timer value
let seqNum = 0;    //the sequence number

module.exports = {
    init: function() {
        timeStamp = Math.ceil(Math.random()*999);
        seqNum = parseInt((Math.pow(2, 20))%(Math.random()*Math.pow(2, 20))) - 1;
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function() {
        return seqNum++;
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function() {
        return timeStamp;
    }
};

setInterval(tick, 10);  //check the timer every 10s

function tick(){    //tick the timer
    if (timeStamp == Math.pow(2, 32))
        timeStamp = Math.ceil(Math.random()*999);
    timeStamp++;    
}