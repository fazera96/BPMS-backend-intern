module.exports= (sequelize, Sequelize) => {
    const Logs = sequelize.define("logs" , {
        log_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        log_desc:{
            type: Sequelize.STRING(30)
        },
        log_datetime:{
            type: Sequelize.STRING(30)
        },
        log_user_id:{
            type:Sequelize.INTEGER(10)
        },
        job_no:{
            type:Sequelize.STRING(30)
        },
        pr_no:{
            type:Sequelize.INTEGER(10)
        },
        pr_item_id:{
            type:Sequelize.INTEGER(10)
        }
    }, {
        timestamps: false,
        tableName: 'logs'
    });
  
    return Logs;
}