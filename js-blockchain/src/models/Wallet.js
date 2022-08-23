const ChainUtil = require("../utils/chain-util");
const Transaction = require("./transaction");
class Wallet
{
    constructor(secret = null, publicKey = null)
    {
        if(secret)
        {
            this.keyPair = ChainUtil.genKeyPair(secret);
        } else if(publicKey)
        {
            this.keyPair = ChainUtil.genKeyFromPublicKey(publicKey);
        }
        this.publicKey = this.keyPair.getPublic("hex");
    }
    sign(dataHash)
    {
        return this.keyPair.sign(dataHash).toHex();
    }
    createTransaction(type,data, transactionPool) {
        let transaction = Transaction.generateTransaction(this,data,type);
        transactionPool.addTransaction(transaction);
        return transaction;
      }
    toString() {
        return `Wallet - 
            publicKey: ${this.publicKey.toString()}`;
    }
}
module.exports = Wallet;