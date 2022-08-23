const SHA256 = require('crypto-js/sha256');
class Block {
    constructor(preHas, transactionlist, timeStamp) {
        this.preHas = preHas;
        this.transactionlist = transactionlist;
        this.timeStamp = timeStamp;
        this.none = 0;
        this.caculatorHas();
    }
    caculatorHas() {
        this.has = SHA256(this.preHas + JSON.stringify(this.transactionlist) + this.timeStamp + this.none).toString();
    }
    mine(difficult) {
        while (this.has.substr(0, difficult) !== "".padEnd(difficult, "0")) {
            this.none++;
            this.caculatorHas();
        }
        console.log("Đào thành công + " + this.has);
    }
}

module.exports = Block;