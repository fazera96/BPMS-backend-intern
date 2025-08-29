module.exports= (sequelize, Sequelize) => {
    const JobSpecsOthers = sequelize.define("jobSpecsOthers" , {
        others_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        job_no:{
            type: Sequelize.STRING(30)
        },
        others_desc:{
            type: Sequelize.STRING(500)
        }
    }, {
        timestamps: false,
        tableName: 'job_specs_others'
    });
  
    return JobSpecsOthers;
}