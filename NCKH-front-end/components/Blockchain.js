const fs = require('fs');
const Block = require('./Block');

class Blockchain {
    constructor(chain) {
        this.difficult = 4;
        this.pendingTransaction = [];
        if (chain.length > 0) {
            this.chain = chain;
        } else {
            let genesis_block = this.createGenesisBlock();
            genesis_block.mine(this.difficult);
            let buf = Buffer.from(JSON.stringify(genesis_block));
            fs.writeFile(__dirname + 'user', buf, (err) => {
                if (err) throw err;
                console.log("JSON data is saved.");
            });
            this.chain = [genesis_block];
        }
    }
    adđNewblock() {
        let newblock = new Block(this.getpreHas(), this.pendingTransaction, Date.now());
        newblock.mine(this.difficult);
        let buf = Buffer.from(JSON.stringify(newblock));
        fs.appendFile(__dirname + 'user', buf, (err) => {
            if (err) throw err;
            console.log("JSON data is saved.");
        });
        this.chain.push(newblock);
    }
    getLastedBlock() {
        return this.chain[this.chain.length - 1];
    }
    getpreHas() {
        let lastedBlock = this.getLastedBlock();
        return lastedBlock.has;
    }
    addPendingTransaction(transaction) {
        this.pendingTransaction.push(transaction);
    }
    createGenesisBlock() {
        let block = new Block("0", "Welcome this is my block", Date.now());
        return block;
    }
}
module.exports = Blockchain;