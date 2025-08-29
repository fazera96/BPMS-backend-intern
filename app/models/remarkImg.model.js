module.exports= (sequelize, Sequelize) => {
    const RemarkImg = sequelize.define("remarkImg" , {
        remarkImg_id:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        remark_id:{
            type: Sequelize.INTEGER(10)
        },
        img_path:{
            type: Sequelize.STRING(500)
        }
    }, {
        timestamps: false,
        tableName: 'remark_img'
    });
  
    return RemarkImg;
}