module.exports= (sequelize, Sequelize) => {
    const Account = sequelize.define("account" , {
        account_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        account_username:{
            type: Sequelize.STRING(100)
        },
        account_password:{
            type: Sequelize.STRING(100)
        },
        account_role:{
            type:Sequelize.INTEGER(2)
        },
        account_lastlogin:{
            type:Sequelize.STRING(30)
        },
        account_lastlogout:{
            type:Sequelize.STRING(30)
        },
        account_email:{
            type:Sequelize.STRING(100)
        }
    }, {
        timestamps: false,
        tableName: 'account'
    });
  
    return Account;
}