class PatriciaTrie
{
    constructor()
    {
        this.root = [];
    }
    
    add(transaction)
    {
        let temp = this.root;
        let hash = transaction.TxID;
        for(let i=0; i<hash.length ; i++)
        {
            if(temp[hash[i]] == undefined)
                temp[hash[i]] = {};
            temp = temp[hash[i]];
        }
        temp['DATA'] = transaction;
    }
    addListTransaction(transactions)
    {   
        for(let i=0; i<transactions.length; i++)
        {
            this.add(transactions[i]);
        }
    }
    get(hash)
    {
        let temp = this.root;
        for(let i=0; i<hash.length ; i++)
        {
           if(temp[hash[i]] != undefined) temp = temp[hash[i]];
           else return null;
        }
        if(temp['DATA']) return temp['DATA'];
        else return null;
    }
    remove(hash)
    {
        let temp = this.root;
        for(let i=0; i<hash.length ; i++)
        {
           if(temp[hash[i]] != undefined) temp = temp[hash[i]];
           else return false;
        }
        if(temp['DATA'])
        {
            delete temp['DATA'];
            return true;
        }
        else return false;
    }
}
module.exports = PatriciaTrie;