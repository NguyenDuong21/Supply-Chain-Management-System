const ChainUtil = require("../utils/chain-util");
class Transaction {
  constructor(type = null,data = null, input = null) {

      this.type = type
      this.data = data;
      this.input = input;
      this.TxID = this.hashTransaction();
  }
  static generateTransaction(senderWallet, data, type) {
    const transaction = new this(type,data);
    Transaction.signTransaction(transaction,senderWallet);
    return transaction;
  }
  hashTransaction()
  {
    let dataHas = `${this.type}-${JSON.stringify(this.data)}`;
    return ChainUtil.hash(dataHas);
  }
  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      publickey: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.data))
    };
  }
  static verifyTransaction(transaction)
  {

    return ChainUtil.verifySignature(transaction.input.publickey,transaction.input.signature,ChainUtil.hash(transaction.data));
  }
  getDetails() {
    const {TxID, type,data} = this;
    return {
      TxID,
      type,
      data,
      input
    };
  }

  parseTransaction(transaction) {
    this.TxID = transaction.TxID;
    this.type = transaction.type;
    this.data = transaction.data;
    this.input = transaction.input;
  }
}

module.exports = Transaction;
