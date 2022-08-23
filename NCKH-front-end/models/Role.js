class Role
{
    constructor(connection)
    {
        this.connection = connection;
    }
    async getAllRole()
    {
        const sqlQuery = "SELECT * FROM tblRoles";
        return new Promise((resolve, reject) => {
            this.connection.request().query(sqlQuery, function(err,data){
                if(err) return reject(err);
                return resolve(data);
            })
        } );
    }
}
module.exports = Role;