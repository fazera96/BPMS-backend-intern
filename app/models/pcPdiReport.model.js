module.exports= (sequelize, Sequelize) => {
    const PcPdiReport = sequelize.define("pcPdiReport" , {
        pdiReport_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        job_no:{
            type: Sequelize.STRING(30)
        },
        pdiReport_attachment:{
            type: Sequelize.STRING(500)
        }
    }, {
        timestamps: false,
        tableName: 'pc_pdi_report'
    });
  
    return PcPdiReport;
}