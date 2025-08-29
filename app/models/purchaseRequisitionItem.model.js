module.exports = (sequelize, Sequelize) => {
    const PurchaseRequisitionItem = sequelize.define("purchaseRequisitionItem", {
      pr_item_id: {
        type: Sequelize.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      pr_no: {
        type: Sequelize.INTEGER(10),
      },
      item_quantity: {
        type: Sequelize.INTEGER(10),
      },
      item_price: {
        type: Sequelize.FLOAT,
      },
      item_desc: {
        type: Sequelize.STRING(30),
      },
      est_delivery_item: {
        type: Sequelize.STRING(30),
      },
      drawing_no: {
        type: Sequelize.STRING(30),
      },
      qty_delivered_item: {
        type: Sequelize.INTEGER(10),
      },
      qty_taken_item: {
        type: Sequelize.INTEGER(10),
      },
      qty_reject_item: {
        type: Sequelize.INTEGER(10),
      },
      qty_replace_item: {
        type: Sequelize.INTEGER(10),
      },
      qty_ok_item: {
        type: Sequelize.INTEGER(10),
      },
      received_by: {
        type: Sequelize.STRING(30),
      },
      delivered_date: {
        type: Sequelize.STRING(30),
      },
      inspect_by: {
        type: Sequelize.STRING(30),
      },
      inspect_date: {
        type: Sequelize.STRING(30),
      },
      taken_by: {
        type: Sequelize.STRING(30),
      },
      taken_date: {
        type: Sequelize.STRING(30),
      },
      modified_by: {
        type: Sequelize.STRING(30),
      },
      modified_date: {
        type: Sequelize.STRING(30),
      },
    }, {
      timestamps: false,
      tableName: "purchase_requisition_item",
    });
  
    return PurchaseRequisitionItem;
  };