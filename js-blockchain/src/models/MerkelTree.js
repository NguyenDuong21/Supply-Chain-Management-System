const {hash} = require("../utils/helper");
class MerkelTree
{
    constructor()
    {
        this.root = [];
    }
    createTree(transactions)
    {
        this.root.unshift(transactions);
        this.root.unshift(transactions.map(t => t.TxID));
        while(this.root[0].length > 1)
        {
            let newArr = [];
            for(let i=0; i < this.root[0].length; i+=2)
            {
                if(i%2 == 0 && i< (this.root[0].length - 1))
                {
                    newArr.push(hash(this.root[0][i] + this.root[0][i+1]));
                } else {
                    newArr.push(this.root[0][i]);
                }
            }
            this.root.unshift(newArr);
        }
    }
    verify(transaction)
    {
        let position = this.root.slice(-1)[0].findIndex(el => el.TxID == transaction.TxID);
        if(position>=0)
        {
            let verifyhash = transaction.hashTransaction();
            for(let i=this.root.length - 2; i>0; i--)
            {
                let neighbour = null;
                if(position %2 == 0)
                {
                    neighbour = this.root[i][position+1];
                    if(neighbour != null)
                        verifyhash = hash(verifyhash + neighbour);
                    position = Math.floor(position/2);
                } else {
                    neighbour = this.root[i][position-1];
                    verifyhash = hash(neighbour + verifyhash);
                    position = Math.floor((position -1)/2);
                }
            }
            return verifyhash == this.root[0][0];
        } else {
        }
    }
}
module.exports = MerkelTree;