module.exports= (sequelize, Sequelize) => {
    const JobSpecs = sequelize.define("jobSpecs" , {
        job_no:{
            type: Sequelize.STRING(30),
            primaryKey: true,
        },
        job_desc:{
            type: Sequelize.STRING(100)
        },
        issue_date:{
            type: Sequelize.STRING(30)
        },
        issue_by:{
            type: Sequelize.STRING(30)
        },
        modified_date:{
            type: Sequelize.STRING(30)
        },
        modified_by:{
            type: Sequelize.STRING(30)
        },
        client_name:{
            type: Sequelize.STRING(30)
        },
        client_contact:{
            type: Sequelize.STRING(30)
        },
        site_location:{
            type: Sequelize.STRING(30)
        },
        delivery_date:{
            type: Sequelize.STRING(100)
        },
        job_type:{
            type: Sequelize.INTEGER(2)
        },
        job_status:{
            type: Sequelize.INTEGER(2)
        },
        job_status_desc:{
            type:Sequelize.STRING(250)
        }
    }, {
        timestamps: false,
        tableName: 'job_specs'
    });
  
    return JobSpecs;
}