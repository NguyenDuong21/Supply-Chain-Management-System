
class User {
    constructor(connection,mssql) {
        this.connection = connection;
        this.mssql = mssql;
    }
    checkUserLogin(username, password)
    {
        // let queryCheck = "SELECT * FROM tblDangNhap WHERE tendangnhap = @username and matkhau = ";
        let queryCheck = `SELECT   tendangnhap , userId , sName , tblRoles.idRoles ,sContact , email ,tblRoles.sRoles  FROM tblDangNhap 
                                inner join tblUser on tblUser.idUser =tblDangNhap.userId 
                                LEFT JOIN tblRoles on tblUser.idRoles = tblRoles.idRoles
                                WHERE tendangnhap = @username and matkhau = @password`
        return new Promise((resolve, reject) => {
            this.connection.request()
                           .input("username", this.mssql.VarChar, username)
                           .input("password", this.mssql.VarChar, password)
                           .query(queryCheck, function(err, data){
                                if(err) reject(err);
                                resolve(data);
                           });
        });
    }
    get_user() {
        return new Promise((resolve, reject) => {
            this.connection.query("select * from users_train inner join role on role.id_role=users_train.role", (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
        });
    }
    get_nUser(){
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM tblDangNhap", (err, result) => {
                if(err){
                    return reject(err);
                }else{
                    return resolve(result)
                }
            })
        });
    }
    get_per(){
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM tblPermision", (err, result) => {
                if(err){
                    return reject(err);
                }
                else{
                    return resolve(result);
                }
            })
        })
    }

    get_mailU(username){
        let queryCheck = `SELECT email 
                                FROM tblUser, tblDangNhap, tblRoles 
                                WHERE tblUser.idUser = tblDangNhap.userId AND tendangnhap = ${username}`
        return new Promise((resolve, reject) => {
            this.connection.query(queryCheck, (err, result) => {
                if(err){
                    return reject(err);
                }else{
                    return resolve(result)
                }
            })
        });
    }
    get_lohang(){
       
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM lohang", (err, result) => {
                if(err){
                    return reject(err);
                }else{
                    return resolve(result)
                }
            })
        });
    }
    get_lohang_hash(){
       
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT TOP 5 * FROM tblLoHang ", (err, result) => {
                if(err){
                    return reject(err);
                }else{
                    return resolve(result)
                }
            })
        });
    }
    get_tblUser(){
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT idUser , sName,sContact,email , tblRoles.sRoles
            FROM tblUser 
            left join tblRoles on tblRoles.idRoles=tblUser.idRoles`, (err, result) => {
                if(err){
                    return reject(err);
                }else{
                    return resolve(result)
                }
            })
        });
    }

}
module.exports = User;