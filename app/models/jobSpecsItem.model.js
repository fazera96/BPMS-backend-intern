module.exports= (sequelize, Sequelize) => {
    const JobSpecsItem = sequelize.define("jobSpecsItem" , {
        item_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        job_no:{
            type: Sequelize.STRING(30)
        },
        item_desc:{
            type: Sequelize.STRING(500)
        }
    }, {
        timestamps: false,
        tableName: 'job_specs_item'
    });
  
    return JobSpecsItem;
}