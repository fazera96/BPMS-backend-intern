module.exports= (sequelize, Sequelize) => {
    const PcProgressReport = sequelize.define("pcProgressReport" , {
        progressReport_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        job_no:{
            type: Sequelize.STRING(30)
        }
    }, {
        timestamps: false,
        tableName: 'pc_progress_report'
    });
  
    return PcProgressReport;
}