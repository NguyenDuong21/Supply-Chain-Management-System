const crypto = require('crypto');
const ChainUtil = require('../utils/chain-util');

const Transaction = require('./transaction');

class Block {
  constructor(timestamp = null, lastHash = null, hash = null, transactions = null, validator = null, signature = null) {
    
      this.timestamp = timestamp;
      this.lastHash = lastHash;
      this.hash = hash;
      this.transactions = transactions;
      this.validator = validator;
      this.signature = signature;
  }

  static createBlock(lastBlock, transactions, wallet) {
    let hash;
    let timestamp = Date.now();
    const lastHash = lastBlock.hash;
    hash = Block.hash(timestamp, lastHash, transactions);
    let validator = wallet.publicKey;
    let signature = Block.signBlockHash(hash, wallet);
    return new this(timestamp, lastHash, hash, transactions, validator,signature);
  }
  static genesis() {
    return new this(`genesis time`, "----", "genesis-hash", [],'','');
  }
  static hash(timestamp,lastHash,transactions) {
    const blockString= `${timestamp}-${lastHash}-${JSON.stringify(transactions)}`;
    const hashFunction = crypto.createHash('sha256');
    hashFunction.update(blockString);
    return hashFunction.digest('hex');
  }
  static signBlockHash(hash, wallet)
  {
    return wallet.sign(hash);
  }
  static verifyBlock(block)
  {
    return ChainUtil.verifySignature(block.validator,block.signature, Block.blockHash(block));
  }
  static blockHash(block)
  {
    const {timestamp,lastHash,transactions} = block;
    return Block.hash(timestamp,lastHash,transactions);
  }
  setProof(proof) {
    this.proof = proof;
  }

  getProof() {
    return this.proof;
  }

  getIndex() {
    return this.index;
  }

  getPreviousBlockHash() {
    return this.previousBlockHash;
  }

  getDetails() {
    const { timestamp, lastHash, hash, transactions, validator,signature } = this;
    return {
      timestamp,
      lastHash,
      hash,
      validator,
      signature,
      transactions: transactions.map(transaction => transaction.getDetails()),
    };
  }

  parseBlock(block) {
    this.timestamp = block.timestamp;
    this.lastHash = block.lastHash;
    this.hash = block.hash;
    this.validator = block.validator;
    this.signature = block.signature;
    this.transactions = block.transactions.map(transaction => {
      const parsedTransaction = new Transaction();
      parsedTransaction.parseTransaction(transaction);
      return parsedTransaction;
    });
  }
  static verifyLeader(block, leader)
  {
    return block.validator == leader ? true : false;
  }
  printTransactions() {
    this.transactions.forEach(transaction => console.log(transaction));
  }
  toString() {
    return `Block - 
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash}
        Hash      : ${this.hash}
        transactions      : ${this.transactions}
        Validator : ${this.validator}
        Signature : ${this.signature}`;
  }
}

module.exports = Block;
