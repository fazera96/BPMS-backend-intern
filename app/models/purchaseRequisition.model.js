module.exports= (sequelize, Sequelize) => {
    const PurchaseRequisition = sequelize.define("purchaseRequisition" , {
        pr_no:{
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        pr_type:{
            type: Sequelize.INTEGER(2)
        },
        job_no:{
            type: Sequelize.STRING(30)
        },
        pr_date:{
            type: Sequelize.STRING(30)
        },
        pr_attachment:{
            type: Sequelize.STRING(500)
        },
        po_no:{
            type: Sequelize.STRING(30)
        },
        po_date:{
            type: Sequelize.STRING(30)
        },
        po_attachment:{
            type: Sequelize.STRING(500)
        },
        po_update_by:{
            type: Sequelize.STRING(100)
        },
        supplier_name:{
            type: Sequelize.STRING(30)
        },
        requestor:{
            type: Sequelize.STRING(30)
        },
        pr_status:{
            type: Sequelize.INTEGER(2)
        },
        currency:{
            type: Sequelize.STRING(5)
        },
        pr_status_desc:{
            type:Sequelize.STRING(250)
        }
    }, {
        timestamps: false,
        tableName: 'purchase_requisition'
    });
  
    return PurchaseRequisition;
}