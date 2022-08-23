const express = require("express");
const app = require('express')();
var cors = require('cors')
const bodyParser = require('body-parser');
const httpServer = require('http').Server(app);
const axios = require('axios');
const io = require('socket.io')(httpServer);
const client = require('socket.io-client');
const fs = require("fs");
const BlockChain = require('./models/chain');
const SocketActions  = require('./constants');
const Transaction = require("./models/transaction");
const socketListeners = require('./socketListeners');
const allNode = require("../ecosystem.json");
const { urlencoded } = require("body-parser");
const { Console } = require("console");
const Block = require("./models/block");
const MerkelTree = require("./models/MerkelTree");
const PatriciaTrie = require("./models/PatriciaTrie");
const Wallet = require("./models/Wallet");
const { v1: uuidv1 } = require('uuid');
const ChainUtil = require("./utils/chain-util");
app.use(express.json());
app.use(urlencoded({
  extended:true
}));
const { PORT } = process.env;
const clientUrl = 'http://localhost:8081/';
// const PORT = 3000;
let wallet = new Wallet(`http://localhost:${PORT}`, null);
let patriciaTrie = new PatriciaTrie();
let blockChain;
function connectionAllNode()
{
  allNode.apps.forEach(function(el,index){
    const port = el.env.PORT;
      blockChain.addNode(socketListeners(client(`http://localhost:${port}`), blockChain,wallet,patriciaTrie));
  })
}
fs.readFile('blocks_two.json', 'utf-8', (err, data) => {
  if (err) {
      console.log(err);
  }
  if(data)
  {
    
        const blocks = JSON.parse(data);
        const arrBlocks = [];
        blocks.forEach(function(block){
            let parseBlock = new Block();
            parseBlock.parseBlock(block);
            patriciaTrie.addListTransaction(parseBlock.transactions);
            arrBlocks.push(parseBlock);
        });
        blockChain = new BlockChain(arrBlocks, io);

        axios.post(clientUrl + 'api/transaction/sendchain')
        .then(response => {
          const blocksClient = JSON.parse(response.data);
          const arrBlocksClient = [];
          blocksClient.forEach(function(block){
              let parseBlockClient = new Block();
              parseBlockClient.parseBlock(block);
              arrBlocksClient.push(parseBlockClient);
          });
          blockChainClient = new BlockChain(arrBlocksClient, io);
          if(blockChain.isValidChain(blockChain.blocks) && blockChainClient.isValidChain(blockChainClient.blocks))
          {
            if(blockChain.blocks.length > blockChainClient.blocks.length)
            {
              let json = JSON.stringify(blockChain.blocks);
              axios.post('http://localhost:8081/api/transaction/receive', {blockchain: json})
              .then(response => {
              });
            }
          }
        });
        
  } else {
    blockChain = new BlockChain(null, io);

  }
  connectionAllNode();
  
});
app.use(cors())

// kết nối các node: mặc định là 2
app.post('/nodes', (req, res) => {
  const { callback } = req.query;
  const { host, port } = req.body;
  const node = `http://${host}:${port}`;
  const socketNode = socketListeners(client(node), blockChain);
  blockChain.addNode(socketNode, blockChain);
  if (callback === 'true') {
    console.info(`Added node ${node} back`);
    res.json({ status: 'Added node Back' }).end();
  } else {
    axios.post(`${node}/nodes?callback=true`, {
      host: req.hostname,
      port: PORT,
    });
    res.json({ status: 'Added node' }).end();
  }
});
app.post("/getFromClient", (req, res) => {
  axios.post(clientUrl + 'api/transaction/sendchain')
        .then(response => {
          const blocks = JSON.parse(response.data);
          const arrBlocks = [];
          blocks.forEach(function(block){
              let parseBlock = new Block();
              parseBlock.parseBlock(block);
              patriciaTrie.addListTransaction(parseBlock.transactions);
              arrBlocks.push(parseBlock);
          });
        });
});
app.post('/getTran',(req,res) => {
  const { dataHas } = req.body;
  // let dataHas = `${type2}-${JSON.stringify(quaData)}`;
  // const hasData = ChainUtil.hash(dataHas);
  res.json(patriciaTrie.get(dataHas));
})
app.get('/getwallet', (req,res) => {
  let secret = uuidv1();
  let wallet = new Wallet(secret,null);
  res.json({publicKey:wallet.publicKey});
})
app.get('/listTxT', (req,res) => {
  res.json(blockChain.currentTransactions);
})
app.post('/transaction', (req, res) => {
  const { type2,loaiqua,soluong,privateKey } = req.body;
  let senderWallet = new Wallet(privateKey, null);
  const quaData = {loaiqua,soluong};
  const transaction = Transaction.generateTransaction(senderWallet,quaData,type2);
  io.emit(SocketActions.ADD_TRANSACTION, JSON.stringify(transaction));
  res.json({message:JSON.stringify(transaction)}).end();
  res.end();
});
// lô hàng.
app.post('/themlo', (req, res) => {
  const { type, farmerRegistrationNo, farmerName, farmerAddress, exporterName, donggoi,privateKey} = req.body;
  let senderWallet = new Wallet(privateKey, null);
  const data = {farmerRegistrationNo, farmerName, farmerAddress, exporterName, donggoi};
  const transaction = Transaction.generateTransaction(senderWallet,data,type);
  io.emit(SocketActions.ADD_TRANSACTION, JSON.stringify(transaction));
  res.json({message:transaction.TxID}).end();
  res.end();
});
app.post('/themthanhtra', (req, res) => {
  const { type, giongcay, loaiphanbon, muavu, privateKey} = req.body;
  let senderWallet = new Wallet(privateKey, null);
  const data = {giongcay, loaiphanbon, muavu};
  const transaction = Transaction.generateTransaction(senderWallet,data,type);
  io.emit(SocketActions.ADD_TRANSACTION, JSON.stringify(transaction));
  res.json({message:transaction.TxID}).end();
  res.end();
});
app.post('/themthuhoach', (req, res) => {
  const { type,loaisanpham, sanluong, donvitinh, privateKey} = req.body;
  console.log({ type,loaisanpham, sanluong, donvitinh, privateKey});
  let senderWallet = new Wallet(privateKey, null);
  const data = {loaisanpham, sanluong, donvitinh};
  const transaction = Transaction.generateTransaction(senderWallet,data,type);
  io.emit(SocketActions.ADD_TRANSACTION, JSON.stringify(transaction));
  res.json({message:transaction.TxID}).end();
  res.end();
});
app.post('/themdonggoi', (req, res) => {
  const { type,madonvi, diacchi, ngaynhan,soluong,donvitinh,ngaydonggoi,hansudung, privateKey} = req.body;
  let senderWallet = new Wallet(privateKey, null);
  const data = {madonvi, diacchi, ngaynhan,soluong,donvitinh,ngaydonggoi,hansudung};
  const transaction = Transaction.generateTransaction(senderWallet,data,type);
  io.emit(SocketActions.ADD_TRANSACTION, JSON.stringify(transaction));
  res.json({message:transaction.TxID}).end();
  res.end();
});
app.post('/themphanphoi', (req, res) => {
  const { type,madonvi, phuongtien, bienso,diachigiao,ngaygiao,soluonggiao,donvitinh,hansudung, privateKey} = req.body;
  let senderWallet = new Wallet(privateKey, null);
  const data = {madonvi, phuongtien, bienso,diachigiao,ngaygiao,soluonggiao,donvitinh,hansudung};
  const transaction = Transaction.generateTransaction(senderWallet,data,type);
  io.emit(SocketActions.ADD_TRANSACTION, JSON.stringify(transaction));
  res.json({message:transaction.TxID}).end();
  res.end();
});
app.post('/themthumua', (req, res) => {
  const { type,madonvi, diachi, ngaynhan,soluongnhan,donvitinh, privateKey} = req.body;
  console.log({ type,madonvi, diachi, ngaynhan,soluongnhan,donvitinh, privateKey});
  let senderWallet = new Wallet(privateKey, null);
  const data = {madonvi, diachi, ngaynhan,soluongnhan, donvitinh};
  const transaction = Transaction.generateTransaction(senderWallet,data,type);
  io.emit(SocketActions.ADD_TRANSACTION, JSON.stringify(transaction));
  res.json({message:transaction.TxID}).end();
  res.end();
});
app.post('/connectclient', (req,res) => {
  const blockExample = {hash:'123456abcxyz', transaction:"data1"};
  axios.post(clientUrl + 'api/transaction/receive', {block: JSON.stringify(blockExample)})
        .then(response => {
          res.send(response.data);
        });

});
app.post('/gettransaction', (req, res) => {
  const { type, farmerRegistrationNo, farmerName, farmerAddress, exporterName, donggoi} = req.body;
  for(let i=0; i<blockChain.blocks.length; i++)
  {
    let transactions = blockChain.blocks[i].transactions;
    for(let j=0; j< transactions.length; j++)
    {
      if(transactions[j].type == 'lohang' 
      && transactions[j].data.farmerRegistrationNo == farmerRegistrationNo
      && transactions[j].data.farmerName == farmerName
      && transactions[j].data.farmerAddress == farmerAddress
      && transactions[j].data.exporterName == exporterName
      && transactions[j].data.donggoi == donggoi
      )
      {
        res.json({message:transactions[j]});
        res.end();
      }
    }
  }
})
app.get('/lengthtransaction', (req, res) => {
  let countTran = 0;
  for(let i=0; i<blockChain.blocks.length; i++)
  {
    let transactions = blockChain.blocks[i].transactions;
    for(let j=0; j< transactions.length; j++)
    {
      countTran++;
    }
  }
  res.send("Number transaction: " + countTran);
  res.end();
})
app.get("/checkChain", (req, res) => {
  let check = blockChain.isValidChain(blockChain.blocks);
  res.send(check);
})
app.get('/pingclient', (req, res) => {
  axios.get(clientUrl + 'api/transaction/receive')
        .then(response => {
          res.send(response.data);
        })
        .catch(err => {
          res.send(err.message);
        });
    
});
app.get('/stake', (req, res) => {
  let {callback} = req.query;
  const stake = Math.floor(Math.random() * 10) + 1;
  io.emit("stakes", wallet.publicKey,stake);
  if(!callback)
  {
    const arrPromise = [];
    allNode.apps.forEach(function(el,index){
      const port = el.env.PORT;
      if(port != PORT)
      {
          arrPromise.push(axios.get(`http://localhost:${port}/stake?callback=true`));
      }
    });
    Promise.all(arrPromise).then(function(values) {
      io.emit("createBlock", "message");
    });
  }
  res.json({message:"success"}).end();
  res.end();
});

app.get('/chain', (req, res) => {
  res.json(blockChain.blocks).end();
});
app.get('/chainlength', (req, res) => {
  res.json(blockChain.blocks.length).end();
});

app.get('/lengthtrain', (req, res) => {
  res.json(blockChain.currentTransactions);
});

io.on('connection', (socket) => {
  let isFirst = true;
  console.info(`Socket connected, ID: ${socket.id}`);
  socket.on("tranMaxLength", (publicKey) => {
    if(wallet.publicKey == publicKey)
    {

      axios.get(`http://localhost:${PORT}/stake`, {})
            .then(res => {
           })
           .catch(err => {
             console.log(err);
           })
      
    }
        });
  socket.on("createBlockSucces", (art)=>{
    isFirst = true;
  });
  socket.on('disconnect', () => {
  });
});

httpServer.listen(PORT, () => console.info(`Express server running on ${PORT}...`));
