module.exports= (sequelize, Sequelize) => {
    const MechanicalAssembly = sequelize.define("mechanicalAssembly" , {
        mechanicalassembly_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        job_no:{
            type: Sequelize.STRING(30)
        },
        activity_status:{
            type: Sequelize.INTEGER(2)
        },
        overall_progress:{
            type: Sequelize.INTEGER(2)
        },
        progress_percentage:{
            type: Sequelize.INTEGER(3)
        },
        estimated_duration:{
            type: Sequelize.STRING(30)
        },
        planned_start_date:{
            type: Sequelize.STRING(30)
        },
        actual_start_date:{
            type: Sequelize.STRING(30)
        },
        date_of_completion:{
            type: Sequelize.STRING(30)
        },
        remarks_schedule:{
            type: Sequelize.STRING(30)
        },
        verified_by:{
            type: Sequelize.STRING(30)
        },
    }, {
        timestamps: false,
        tableName: 'mechanicalassembly'
    });
  
    return MechanicalAssembly;
}