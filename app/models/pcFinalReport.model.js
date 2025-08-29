module.exports= (sequelize, Sequelize) => {
    const PcFinalReport = sequelize.define("pcFinalReport" , {
        finalReport_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        job_no:{
            type: Sequelize.STRING(30)
        },
        finalReport_attachment:{
            type: Sequelize.STRING(500)
        }
    }, {
        timestamps: false,
        tableName: 'pc_final_report'
    });
  
    return PcFinalReport;
}