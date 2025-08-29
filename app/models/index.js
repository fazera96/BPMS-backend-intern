require('dotenv').config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  operatorsAliases: false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    min: parseInt(process.env.DB_POOL_MIN) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE) || 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.account = require("./account.model.js")(sequelize, Sequelize);
db.logs = require("./logs.model.js")(sequelize, Sequelize);
db.jobSpecs = require("./jobSpecs.model.js")(sequelize,Sequelize);
db.jobSpecsReq = require("./jobSpecsReq.model.js")(sequelize,Sequelize);
db.jobSpecsItem = require("./jobSpecsItem.model.js")(sequelize,Sequelize);
db.jobSpecsOthers = require("./jobSpecsOthers.model.js")(sequelize,Sequelize);
db.purchaseRequisition = require("./purchaseRequisition.model.js")(sequelize,Sequelize);
db.purchaseRequisitionItem = require("./purchaseRequisitionItem.model.js")(sequelize,Sequelize);
db.pcFinalReport = require("./pcFinalReport.model.js")(sequelize,Sequelize);
db.pcPdiReport = require("./pcPdiReport.model.js")(sequelize,Sequelize);
db.pcProgressReport = require("./pcProgressReport.model.js")(sequelize,Sequelize);
db.electricalDesign = require("./electricalDesign.model.js")(sequelize,Sequelize);
db.factoryAcceptance = require("./factoryAcceptance.model.js")(sequelize,Sequelize);
db.mechanicalAssembly = require("./mechanicalAssembly.model.js")(sequelize,Sequelize);
db.mechanicaldesign = require("./mechanicalDesign.model.js")(sequelize,Sequelize);
db.packagingDelivery = require("./packagingDelivery.model.js")(sequelize,Sequelize);
db.production = require("./production.model.js")(sequelize,Sequelize);
db.programmingTesting = require("./programmingTesting.model.js")(sequelize,Sequelize);
db.siteInstallation = require("./siteInstallation.model.js")(sequelize,Sequelize);
db.standardPartsOrder = require("./standardPartsOrder.model.js")(sequelize,Sequelize);
db.remarkImg = require("./remarkImg.model.js")(sequelize,Sequelize);
db.remarksDesc = require("./remarksDesc.model.js")(sequelize,Sequelize);

// Associations
db.purchaseRequisition.hasMany(db.purchaseRequisitionItem, {
  foreignKey: 'pr_no',
  sourceKey: 'pr_no'
});

// Relationship: account_id in account is primary key for foreign key issue_by and modified_by in jobSpecs
db.account.hasMany(db.jobSpecs, { foreignKey: 'issue_by', sourceKey: 'account_id' });
db.account.hasMany(db.jobSpecs, { foreignKey: 'modified_by', sourceKey: 'account_id' });
db.jobSpecs.belongsTo(db.account, { foreignKey: 'issue_by', targetKey: 'account_id', as: 'issuer' });
db.jobSpecs.belongsTo(db.account, { foreignKey: 'modified_by', targetKey: 'account_id', as: 'modifier' });

// Relationship: account_id in account is primary key for foreign key requestor and po_update_by in pr
db.account.hasMany(db.purchaseRequisition, { foreignKey: 'requestor', sourceKey: 'account_id' });
db.account.hasMany(db.purchaseRequisition, { foreignKey: 'po_update_by', sourceKey: 'account_id' });
db.purchaseRequisition.belongsTo(db.account, { foreignKey: 'requestor', targetKey: 'account_id', as: 'pr_creator' });
db.purchaseRequisition.belongsTo(db.account, { foreignKey: 'po_update_by', targetKey: 'account_id', as: 'po_updater' });

// Relationship: job_no in jobspecs is primary key for foreign key job_no in pr
db.jobSpecs.hasMany(db.purchaseRequisition, {foreignKey:'job_no', sourceKey:'job_no'});
db.purchaseRequisition.belongsTo(db.jobSpecs, { foreignKey:'job_no', sourceKey:'job_no', as: 'job_specs' });

module.exports = db;
