
class LoHang {
    constructor(connection,mssql) {
        this.connection = connection;
        this.mssql = mssql;
    }
    insertLoHang(mahash)
    {
        let queryCheck = `INSERT INTO tblLoHang (mahash) VALUES (@mahash)`;
        return new Promise((resolve, reject) => {
            this.connection.request()
                           .input("mahash", this.mssql.VarChar, mahash)
                           .query(queryCheck, function(err, data){
                                if(err) reject(err);
                                resolve(data);
                           });
        });
    }
    insertGiaidoan(mahash)
    {
        let queryCheck = `INSERT INTO tblGiaiDoan (lohang) VALUES (@mahash)`;
        return new Promise((resolve, reject) => {
            this.connection.request()
                           .input("mahash", this.mssql.VarChar, mahash)
                           .query(queryCheck, function(err, data){
                                if(err) reject(err);
                                resolve(data);
                           });
        });
    }
    updateGiaiDoan(mahash, giaidoan, malo)
    {
        let queryCheck = `UPDATE tblGiaiDoan set ${giaidoan} = @mahash where lohang = @malo`;
        return new Promise((resolve, reject) => {
            this.connection.request()
                           .input("mahash", this.mssql.VarChar, mahash)
                           .input("malo", this.mssql.VarChar, malo)
                           .query(queryCheck, function(err, data){
                                if(err) reject(err);
                                resolve(data);
                           });
        });
    }
    insertStatusLoHang(mahash)
    {
        let queryCheck = `INSERT INTO lohang (idlohang, statusthanhtra, statusdonvithuhoach, statusdonvidonggoi, statusphanphoi, statusthumua, statuslohang) VALUES (@idlohang, @statusthanhtra, @statusdonvithuhoach, @statusdonvidonggoi, @statusphanphoi, @statusthumua, @statuslohang)`;
        return new Promise((resolve, reject) => {
            this.connection.request()
                           .input("idlohang", this.mssql.VarChar, mahash)
                           .input("statusthanhtra", this.mssql.Int, 1)
                           .input("statusdonvithuhoach", this.mssql.Int, 1)
                           .input("statusdonvidonggoi", this.mssql.Int, 1)
                           .input("statusphanphoi", this.mssql.Int, 1)
                           .input("statusthumua", this.mssql.Int, 1)
                           .input("statuslohang", this.mssql.Int, 0)
                           .query(queryCheck, function(err, data){
                                if(err) reject(err);
                                resolve(data);
                           });
        });
        
    }
    updateStatusLohang(mahashlohang, loaistatus, giatri)
    {
        let queryCheck = `UPDATE lohang set ${loaistatus} = @giatri where idlohang = @mahashlohang`;
        return new Promise((resolve, reject) => {
            this.connection.request()
                           .input("mahashlohang", this.mssql.VarChar, mahashlohang)
                           .input("giatri", this.mssql.Int, giatri)
                           .query(queryCheck, function(err, data){
                                if(err) reject(err);
                                resolve(data);
                           });
        });
        
    }
    laygiaidoan(mahashlohang)
    {
        let queryCheck = "SELECT * FROM tblGiaiDoan where lohang = @mahashlohang";
        return new Promise((resolve, reject) => {
            this.connection.request()
                           .input("mahashlohang", this.mssql.VarChar, mahashlohang)
                           .query(queryCheck, function(err, data){
                                if(err) reject(err);
                                resolve(data);
                           });
        });
    }
}
module.exports = LoHang;