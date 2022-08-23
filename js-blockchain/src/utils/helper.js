const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');
function hash(data)
{
    return data != null ?
            crypto.createHash('sha256')
                  .update(data.toString())
                  .digest("hex")
                  :"";
}
function id(){
    return uuidv1();
}
module.exports = {hash,id};