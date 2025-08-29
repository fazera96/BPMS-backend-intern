module.exports= (sequelize, Sequelize) => {
    const RemarksDesc = sequelize.define("remarksDesc" , {
        remark_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        job_no:{
            type: Sequelize.STRING(30)
        },
        date:{
            type: Sequelize.STRING(30)
        },
        activities_category:{
            type: Sequelize.INTEGER(2)
        },
        remarks_desc:{
            type: Sequelize.STRING(100)
        },
        username:{
            type: Sequelize.STRING(100)
        },
        datetime_created:{
            type: Sequelize.STRING(30)
        }
    }, {
        timestamps: false,
        tableName: 'remarks_desc'
    });
  
    return RemarksDesc;
}