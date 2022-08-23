const SocketActions = require('./constants');
const Transaction = require('./models/transaction');
const ChainUtil = require("./utils/chain-util");
const Blockchain = require('./models/chain');
const Wallet = require("./models/Wallet");
const Block = require("./models/block");
const fs = require("fs");
const axios = require('axios');

const socketListeners = (socket, chain,wallet,patriciaTrie) => {
  socket.on(SocketActions.ADD_TRANSACTION, (transaction) => {
    const transactionRecive = JSON.parse(transaction);

    if(Transaction.verifyTransaction(transactionRecive))
    {
      chain.newTransaction(transactionRecive);
      patriciaTrie.add(transactionRecive);
      if(chain.currentTransactions.length == 2)
      {
        socket.emit("tranMaxLength", wallet.publicKey);
      }
    }
    
    // console.info(`Added transaction: ${JSON.stringify(transaction.getDetails(), null, '\t')}`);
  });
  socket.on("stakes",(address,stake) => {
    chain.stakes.addStake(address,stake);
  });
  
  socket.on("createBlock",(message) => {
    if(chain.stakes.getMax() == wallet.publicKey)
    {
      const block = Block.createBlock(chain.blocks[chain.blocks.length - 1],chain.currentTransactions,wallet);
      
      let listBlock = [...chain.blocks];
      listBlock.push(block);
      let json = JSON.stringify(listBlock); //convert it back to json
      axios.post('http://localhost:8081/api/transaction/receive', {blockchain: json})
        .then(response => {
        });
        fs.writeFile("blocks_two.json", json, "utf8", (err) => {
          if (err) {
            throw err;
          }
        });
        
      chain.io.emit("block",JSON.stringify(block));
    }
  });
  socket.on("block", (block) => {
    const parseBlock = JSON.parse(block);
    chain.blocks.push(parseBlock);
    socket.emit("createBlockSucces", "Success");
    chain.currentTransactions = [];
  })
  socket.on(SocketActions.END_MINING, (newChain) => {
    process.env.BREAK = true;
    const blockChain = new Blockchain();
    blockChain.parseChain(newChain);
    if (blockChain.checkValidity() && blockChain.getLength() >= chain.getLength()) {
      chain.blocks = blockChain.blocks;
    }
  });
  return socket;
};

module.exports = socketListeners;
