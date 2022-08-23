const EDDSA = require("elliptic").eddsa;
const eddsa = new EDDSA("ed25519");
const crypto = require("crypto");
class ChainUtil
{
    static genKeyPair(secret)
    {
        return eddsa.keyFromSecret(secret);
    }
    static genKeyFromPublicKey(publicKey)
    {
        return eddsa.keyFromPublic(publicKey);
    }
    static hash(data)
    {
        return data != null ?
                crypto.createHash('sha256')
                    .update(data.toString())
                    .digest("hex")
                    :"";
    }
    static verifySignature(publicKey, signature, dataHass)
    {
        return eddsa.keyFromPublic(publicKey).verify(dataHass,signature);   
    }
}
module.exports = ChainUtil;