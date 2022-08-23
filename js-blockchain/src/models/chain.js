const Block = require("./block");
const fs = require("fs");
const actions = require("../constants");
const Stake = require("../models/Stake");
const Wallet = require("../models/Wallet");
const { v1: uuidv1 } = require('uuid');
const { generateProof, isProofValid } = require("../utils/proof");

class Blockchain {
  constructor(blocks, io) {
    this.blocks = blocks || [Block.genesis()];
    this.currentTransactions = [];
    this.stakes = new Stake();
    this.nodes = [];
    this.io = io;
  }

  addNode(node) {
    this.nodes.push(node);
  }
  
  mineBlock(block) {
    this.blocks.push(block);
    this.io.emit(actions.END_MINING, this.toArray());
  }

  async newTransaction(transaction) {
    this.currentTransactions.push(transaction);
    // if (this.currentTransactions.length === 2) {
      // console.info("Starting mining block...");
      // const previousBlock = this.lastBlock();
      // process.env.BREAK = false;
      // const block = new Block(
      //   previousBlock.getIndex() + 1,
      //   previousBlock.hashValue(),
      //   previousBlock.getProof(),
      //   this.currentTransactions
      // );
      // const { proof, dontMine } = await generateProof(previousBlock.getProof());
      // block.setProof(proof);
      // this.currentTransactions = [];
      // if (dontMine !== "true") {
      //   this.mineBlock(block);
      //   let json = JSON.stringify(this.blocks); //convert it back to json
      //   fs.writeFile("blocks_two.json", json, "utf8", (err) => {
      //     if (err) {
      //       throw err;
      //     }
      //     // console.log("JSON data is saved.");
      //   });
      // }
    // }
  }

  isValidBlock(block)
  {
    const lastBlock = this.blocks[this.blocks.length - 1];
    if(block.lastHash === lastBlock.hash && block.hash === Block.blockHash(block) && Block.verifyBlock(block) && Block.verifyLeader(block,this.getLeader()))
    {
      return true;
    }
    return false;
  }
  getLeader()
  {
    return this.stakes.getMax();
  }
  isValidChain(chain)
  {
    if(JSON.stringify(chain[0]) != JSON.stringify(Block.genesis()))
      return false;
    for(let i=1; i<chain.length; i++)
    {
      let block = chain[i];
      let preBlock = chain[i-1];
      if((block.lastHash !== preBlock.hash) || (block.hash !== Block.blockHash(block)))
        return false;
    }
    return true;
  }

  replaceChain(newChain)
  {
    if(newChain.length <= this.blocks.length){
      console.log("Recieved chain is not longer than the current chain");
      return;
  }else if(!this.isValidChain(newChain)){
      console.log("Recieved chain is invalid");
      return;
  }
  
  console.log("Replacing the current chain with new chain");
  this.blocks = newChain; 
  }
  // checkValidity() {
  //   const { blocks } = this;
  //   let previousBlock = blocks[0];
  //   for (let index = 1; index < blocks.length; index++) {
  //     const currentBlock = blocks[index];
  //     if (currentBlock.getPreviousBlockHash() !== previousBlock.hashValue()) {
  //       return false;
  //     }
  //     // if (!isProofValid(previousBlock.getProof(), currentBlock.getProof())) {
  //     //   return false;
  //     // }
  //     previousBlock = currentBlock;
  //   }
  //   return true;
  // }

  parseChain(blocks) {
    this.blocks = blocks.map((block) => {
      const parsedBlock = new Block(0);
      parsedBlock.parseBlock(block);
      return parsedBlock;
    });
  }

  toArray() {
    return this.blocks.map((block) => block.getDetails());
  }
  printBlocks() {
    this.blocks.forEach((block) => console.log(block));
  }
}

module.exports = Blockchain;
