class Stake
{
    constructor()
    {
        this.address = [];
        this.balance = {};
    }
    initialize(address)
    {   
        if(this.balance[address] == undefined)
        {
            this.balance[address] = 0;
            this.address.push(address);
        }
    }
    addStake(from, amount)
    {
        this.initialize(from);
        this.balance[from] +=amount;
    }
    getBalance(address) {
        this.initialize(address);
        return this.balance[address];
    }
    getMax() {
        let balance = -1;
        let leader = undefined;
        this.address.forEach(address1 => {
          if (this.getBalance(address1) > balance) {
            balance = this.getBalance(address1);
            leader = address1;
          }
        });
        return leader;
    }
}
module.exports = Stake;