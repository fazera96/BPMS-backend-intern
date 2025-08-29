module.exports= (sequelize, Sequelize) => {
    const JobSpecsReq = sequelize.define("jobSpecsReq" , {
        requirement_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        job_no:{
            type: Sequelize.STRING(30)
        },
        requirement_desc:{
            type: Sequelize.STRING(500)
        }
    }, {
        timestamps: false,
        tableName: 'job_specs_requirement'
    });
  
    return JobSpecsReq;
}