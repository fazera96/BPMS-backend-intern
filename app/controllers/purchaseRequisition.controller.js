const nodemailer = require("nodemailer");
const db = require("../models");
const JobSpecs = db.jobSpecs;
const PurchaseRequisition = db.purchaseRequisition;
const PurchaseRequisitionItem = db.purchaseRequisitionItem;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const Account = db.account;
const Log = db.logs;
const fs = require('fs');

const secretKey = process.env.JWT_SECRET;

// Configure your email account (replace these with your actual email credentials)
const transporter = nodemailer.createTransport({
    host: 'mail.billionprima.com.my', // Your domain's SMTP server
    port: 465,                        // Common port for TLS/STARTTLS; verify with your provider
    secure: true,                    // true for port 465, false for other ports
    auth: {
      user: 'cargo-notification@billionprima.com.my', // Your email address
      pass: '_GzHD}iM^+f1',         // Your email password
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true,  // Enable debug output
});

// pr_status: 1 - Pending Approval, 2 - Store Checking, 3 - Approved, 4 - Rejected, 5 - Waiting Delivery, 6 - Complete
// pr_type: 1 - Store, 2 - Goods, 3 - Services

function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

//get job number for select option
exports.getJobNo = (req, res) => {
    let authToken = req.headers.authorization;

    jwt.verify(authToken, secretKey, (err, user) => {
        if(err){
            console.log("Unauthorized User :getJobNo")
            res.status(401).send({
                message:err.message
            });
        }else{
            console.log("Authorized User :getJobNo")
            JobSpecs.findAll({
            attributes: ['job_no', 'job_desc'],
            where: {
                job_status: {
                    [Op.or]: [2] // Only include jobs approved
                }
            },
            order: [['job_no', 'ASC']]
            })
            .then(data => {
                res.send({
                    data,
                    message: `Successfully retrieved job numbers for PR`
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                });
            })
        }
    });
    
}

//Create PR
exports.createPR = async (req, res) => {
    let authToken = req.headers.authorization;

    jwt.verify(authToken, secretKey, async (err, user) => {
        if(err){
            console.log("Unauthorized User :createPR")
            res.status(401).send({
                message:err.message
            });
        }else{
            console.log("Authorized User :createPR")
            try {

                const { pr_type, job_no, pr_date, supplier_name, currency, requestor } = req.body;
                const pr_attachment =  req.file ? req.file.path : "";
                const items = req.body.items ? JSON.parse(req.body.items) : [];

                console.log("Creating Purchase Requisition with data:", {
                    pr_type,
                    job_no,
                    pr_date,
                    pr_attachment,
                    supplier_name,
                    requestor,
                    currency,
                    items
                });

                if (!req.file && pr_type != 1) {
                    return res.send({
                        status: false,
                        message: "File upload failed or file not exist. Purchase Requisition not submitted."
                    });
                }

                //Create Purchase Requisition
                const pr = await PurchaseRequisition.create({
                    pr_type,
                    job_no,
                    pr_date,
                    pr_attachment,
                    supplier_name,
                    requestor,
                    currency,
                    pr_status: pr_type==1? 2: 1 // 1: Pending Approval , 2: Store Checking
                });

                // Create Purchase Requisition Items if pr number provided
                if (items && items.length > 0 && pr && pr.pr_no) {
                    const itemsToCreate = items.map(item => ({
                        pr_no: pr.pr_no,
                        item_desc: item.item_desc,
                        item_quantity: item.item_quantity,
                        // delivered_date: item.delivered_date,
                        est_delivery_item: item.est_delivery_item,
                        drawing_no: item.drawing_no,
                        item_price: item.item_price,
                    }));
                    await PurchaseRequisitionItem.bulkCreate(itemsToCreate);
                }

                let createdByUsername = '';
                if (requestor) {
                    const createdByAccount = await Account.findOne({ where: { account_id: requestor} });
                    if (createdByAccount) {
                        createdByUsername = createdByAccount.account_username;
                    }
                }
                
                if( pr_type == 1){
                    //Send email to store keeper role = 2
                    await Account.findAll(
                    { where: { account_role: 2 } }
                    ).then((data) => {
                        if (data) {
                            data.forEach((user) => {
                            console.log("Email sent to:", user.account_email);
                            transporter.sendMail({
                                from: "cargo-notification@billionprima.com.my",
                                to: user.account_email,
                                subject: "New Store Purchase Requisition",
                                text: `A new store purchase requisition has been created by ${createdByUsername} under Job Number: ${job_no}`,
                            });
                            });
                        }
                    }).catch((error) => {
                        console.error("Error fetching account email:", error);
                    });
                }else {
                    //Send email to manager role = 5
                    await Account.findAll(
                    { where: { account_role: 5 } }
                    ).then((data) => {
                        if (data) {
                            data.forEach((user) => {
                            console.log("Email sent to:", user.account_email);
                            transporter.sendMail({
                                from: "cargo-notification@billionprima.com.my",
                                to: user.account_email,
                                subject: `New ${pr_type==2?"Goods":"Services"} Purchase Requisition`,
                                text: `A new ${pr_type==2?"goods":"services"} purchase requisition has been created by ${createdByUsername} under Job Number: ${job_no}`,
                            });
                            });
                        }
                    }).catch((error) => {
                        console.error("Error fetching account email:", error);
                    });
                }

                await Log.create({
                    pr_no: pr.pr_no,
                    log_user_id: requestor,
                    log_datetime: formatDateTime(new Date()),
                    log_desc: ` ${pr_type==1?"Store":pr_type==2?"Goods":"Services"} Purchase Requisition Number ${pr.pr_no} has been created by ${createdByUsername} under Job Number: ${job_no}`,
                }).then(() => {
                    console.log("Log created successfully");
                }).catch((error) => {
                    console.error("Error creating log:", error);
                });

                res.send({
                    status: true,
                    message: "Purchase Requisition and items created successfully"
                });
            } catch (err) {
                // Delete uploaded file if it exists
                if (req.file && req.file.path) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (deleteErr) {
                        console.error("Failed to delete uploaded file:", deleteErr);
                    }
                }
                console.error("Error creating Purchase Requisition:", err);
                res.send({
                    status: false,
                    message: "An error occurred while creating the Purchase Requisition."
                });
            }
        }
    });
    

}

//get all PR List
exports.getPRList = async (req, res) => {
    let authToken = req.headers.authorization;

    jwt.verify(authToken, secretKey, async (err, user) => {
        if(err){
            console.log("Unauthorized User :getPRList")
            res.status(401).send({
                message:err.message
            });
        }else{
            console.log("Authorized User :getPRList")
            const { job_no, pr_no, pr_status } = req.query;
            const whereClause = {};
            //job_no want to use like with % before and after
            if (job_no) {
                whereClause.job_no = {
                    [Op.like]: `%${job_no}%`
                };
            }
            if (pr_no) { whereClause.pr_no = pr_no; }
            if (pr_status) { whereClause.pr_status = pr_status; }

            try {
                const pr =  await PurchaseRequisition.findAll({
                    attributes: ['job_no', 'pr_no', 'pr_type', 'pr_date', 'po_no', 'supplier_name', 'requestor', 'pr_status'],
                    include: [
                        {
                            model: Account,
                            as: 'pr_creator',
                            attributes: ['account_username']
                        },
                    ],
                    where: whereClause,
                    order: [['pr_date', 'DESC']]
                })

                res.send({
                    status: true,
                    pr,
                    message: "Successfully retrieved Purchase Requisition list"
                });
                
            } catch (err) {
                console.error("Error creating Purchase Requisition:", err);
                res.send({
                    status: false,
                    message: "An error occurred while retrieving Purchase Requisitions."
                });
            }
        }
    });
}

//to get purchase requisition details by pr_no. contains all pr details and items
exports.getPRDetails = async (req, res) => {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if(err){
            console.log("Unauthorized User :getPRDetails")
            res.status(401).send({
                message:err.message
            });
        } else {
            console.log("Authorized User :getPRDetails")
            const pr_no = req.params.pr_no;
            try {
                const pr = await PurchaseRequisition.findOne({
                    where: { pr_no },
                    include: [
                        {
                            model: JobSpecs,
                            as: 'job_specs',
                            attributes : ['job_no','job_desc']
                        },
                        {
                            model: Account,
                            as: 'pr_creator',
                            attributes: ['account_username']
                        },
                        {
                            model: Account,
                            as: 'po_updater',
                            attributes: ['account_username']
                        },
                        {
                            model: PurchaseRequisitionItem,
                            as: 'purchaseRequisitionItems'
                        }
                    ]
                });
                if (!pr) {
                    return res.send({
                        status: false,
                        message: "Purchase Requisition not found"
                    });
                }
                res.send({
                    status: true,
                    pr,
                    message: "Successfully retrieved Purchase Requisition details"
                });
            } catch (err) {
                console.error("Error retrieving Purchase Requisition details:", err);
                res.send({
                    status: false,
                    message: "An error occurred while retrieving Purchase Requisition details."
                });
            }
        }
    });
}

//get purchase requisition details by pr_no for editing
exports.getUpdatePRDetails = async (req, res) => {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if(err){
            console.log("Unauthorized User :getUpdatePRDetails")
            res.status(401).send({
                message:err.message
            });
        } else {
            console.log("Authorized User :getUpdatePRDetails")
            const pr_no = req.params.pr_no;
            try {
                const pr = await PurchaseRequisition.findOne({
                    where: { pr_no },
                    include: [
                        {
                            model: JobSpecs,
                            as: 'job_specs',
                            attributes : ['job_desc']
                        },
                        {
                            model: Account,
                            as: 'pr_creator',
                            attributes: ['account_username']
                        },
                        {
                            model: Account,
                            as: 'po_updater',
                            attributes: ['account_username']
                        },
                        {
                        model: PurchaseRequisitionItem,
                        as: 'purchaseRequisitionItems'
                        }
                    ]
                });
                if (!pr) {
                    return res.send({
                        status: false,
                        message: "Purchase Requisition not found"
                    });
                }
                res.send({
                    status: true,
                    pr,
                    message: "Successfully retrieved Purchase Requisition details for editing"
                });
            } catch (err) {
                console.error("Error retrieving Purchase Requisition details for editing:", err);
                res.send({
                    status: false,
                    message: "An error occurred while retrieving Purchase Requisition details for editing."
                });
            }
        }
    });
}

//to update the created purchase requisition and update or add purchase requisition item after rejected by manager / update from replacement or rejected items.
exports.updatePRDetails = async (req, res) => {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if (err) {
            console.log("Unauthorized User :updatePRDetails");
            res.status(401).send({
                message:err.message
            });
        } else{
            console.log("Authorized User :updatePRDetails");
            const pr_no = req.params.pr_no;
            try {
                const { pr_type, job_no, pr_date, supplier_name, currency, requestor } = req.body;
                const pr_attachment = req.file ? req.file.path : "";
                const items = req.body.items ? JSON.parse(req.body.items) : [];

                // Find existing PR
                const pr = await PurchaseRequisition.findOne({ where: { pr_no } });
                if (!pr) {
                    return res.send({
                        status: false,
                        message: "Purchase Requisition not found"
                    });
                }

                // Handle attachment update
                if (req.file && pr.pr_attachment && pr.pr_attachment !== pr_attachment) {
                    console.log("Update attachment")
                    try {
                        fs.unlinkSync(pr.pr_attachment);
                    } catch (deleteErr) {
                        console.error("Failed to delete old attachment file:", deleteErr);
                    }
                }else{
                    console.log("No update on attachement")
                }

                // Require attachment for non-store PR
                if (!req.file && pr_type != 1 && !pr.pr_attachment) {
                    return res.send({
                        status: false,
                        message: "File upload failed or file not exist. Purchase Requisition not updated."
                    });
                }

                // Update PR fields
                pr.pr_type = pr_type;
                pr.job_no = job_no;
                pr.pr_date = pr_date;
                pr.supplier_name = supplier_name;
                pr.currency = currency;
                pr.requestor = requestor;
                if (pr_attachment) pr.pr_attachment = pr_attachment;
                pr.pr_status = pr_type == 1 ? 2 : 1;
                await pr.save();

                // Update or Create PR items
                const existingItems = await PurchaseRequisitionItem.findAll({ where: { pr_no } });
                const existingItemIds = existingItems.map(item => item.pr_item_id);

                // Update existing and add new items
                for (const item of items) {
                    if (item.pr_item_id && existingItemIds.includes(item.pr_item_id)) {
                        // Update
                        console.log("Updating item:", item);
                        await PurchaseRequisitionItem.update(
                            {
                                item_desc: item.item_desc,
                                item_quantity: item.item_quantity,
                                // delivered_date: item.delivered_date,
                                est_delivery_item: item.est_delivery_item,
                                drawing_no: item.drawing_no,
                                item_price: item.item_price,
                            },
                            { where: { pr_item_id: item.pr_item_id } }
                        );
                    } else {
                        // Create
                        console.log("Create item:", item);
                        await PurchaseRequisitionItem.create({
                            pr_no: pr.pr_no,
                            item_desc: item.item_desc,
                            item_quantity: item.item_quantity,
                            // delivered_date: item.delivered_date,
                            est_delivery_item: item.est_delivery_item,
                            drawing_no: item.drawing_no,
                            item_price: item.item_price,
                        });
                    }
                }

                // Delete items not in the new list (only those that exist in DB and not in the new items list)
                const newItemIds = items.filter(i => i.pr_item_id).map(i => i.pr_item_id);
                const itemsToDelete = existingItems.filter(item => item.pr_item_id && !newItemIds.includes(item.pr_item_id));
                
                if (itemsToDelete.length > 0) {
                    console.log("Items to delete:", itemsToDelete);
                    await PurchaseRequisitionItem.destroy({
                        where: {
                            pr_no,
                            pr_item_id: itemsToDelete.map(item => item.pr_item_id)
                        }
                    });
                }

                let updatedByUsername = '';
                if (requestor) {
                    const updatedByAccount = await Account.findOne({ where: { account_id: requestor} });
                    if (updatedByAccount) {
                        updatedByUsername = updatedByAccount.account_username;
                    }
                }

                // Send notification email
                if (pr_type == 1) {
                    // Store keeper
                    const storeKeepers = await Account.findAll({ where: { account_role: 2 } });
                    for (const user of storeKeepers) {
                        transporter.sendMail({
                            from: "cargo-notification@billionprima.com.my",
                            to: user.account_email,
                            subject: "Updated Store Purchase Requisition",
                            text: `The store purchase requisition has been updated by ${updatedByUsername} under Job Number: ${job_no}`,
                        });
                    }
                } else {
                    // Manager
                    const managers = await Account.findAll({ where: { account_role: 5 } });
                    for (const user of managers) {
                        transporter.sendMail({
                            from: "cargo-notification@billionprima.com.my",
                            to: user.account_email,
                            subject: `Updated ${pr_type == 2 ? "Goods" : "Services"} Purchase Requisition`,
                            text: `The ${pr_type == 2 ? "goods" : "services"} purchase requisition has been updated by ${updatedByUsername} under Job Number: ${job_no}`,
                        });
                    }
                }

                // Log the update
                await Log.create({
                    pr_no: pr.pr_no,
                    log_user_id: requestor,
                    log_datetime: formatDateTime(new Date()),
                    log_desc: ` ${pr_type == 1 ? "Store" : pr_type == 2 ? "Goods" : "Services"} Purchase Requisition Number ${pr.pr_no} has been updated by ${updatedByUsername} under Job Number: ${job_no}`,
                });

                res.send({
                    status: true,
                    message: "Purchase Requisition and items updated successfully"
                });
            } catch (err) {
                // Delete uploaded file if it exists
                if (req.file && req.file.path) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (deleteErr) {
                        console.error("Failed to delete uploaded file:", deleteErr);
                    }
                }
                console.error("Error updating Purchase Requisition:", err);
                res.send({
                    status: false,
                    message: "An error occurred while updating the Purchase Requisition."
                });
            }
        }
    });
};

//to view file pr attachment 
exports.viewPRAttachment = async (req, res) => {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if (err) {
            console.log("Unauthorized User :viewPRAttachment");
            res.status(401).send({
                message:err.message
            });
        } else {
            console.log("Authorized User :viewPRAttachment");
            const pr_no = req.params.pr_no;
            try {
                const pr = await PurchaseRequisition.findOne({ where: { pr_no } });
                if (!pr || !pr.pr_attachment) {
                    return res.send({ status: false, message: "Attachment not found" });
                }
                const filePath = pr.pr_attachment;
                if (!fs.existsSync(filePath)) {
                    return res.send({ status:false, message: "File does not exist" });
                }
                res.sendFile(filePath);
            } catch (err) {
                console.error("Error viewing PR attachment:", err);
                res.send({ status:false,  message: "An error occurred while retrieving the attachment." });
            }
        }
    });
};

//to get PO detail by pr_no
exports.getPODetails = async (req, res) => {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if (err) {
            console.log("Unauthorized User :getPODetail");
            res.status(401).send({
                message:err.message
            });
        } else {
            console.log("Authorized User :getPODetail");
            const pr_no = req.params.pr_no;
            try {
                const pr = await PurchaseRequisition.findOne({
                    include: [
                        {
                            model: Account,
                            as: 'po_updater',
                            attributes: ['account_username']
                        }
                    ],
                    where: { pr_no },
                    attributes: ['po_no', 'po_date', 'po_attachment', 'po_update_by']
                });
                if (!pr) {
                    return res.send({ status: false, message: "PO detail not found" });
                }
                res.send({
                    status: true,
                    po: {
                        po_no: pr.po_no,
                        po_date: pr.po_date,
                        po_attachment: pr.po_attachment,
                        po_update_by: pr.po_update_by
                    },
                    message: "Successfully retrieved PO detail"
                });
            } catch (err) {
                console.error("Error retrieving PO detail:", err);
                res.send({ status: false, message: "An error occurred while retrieving PO detail." });
            }
        }
    });
};

//to update PO detail by pr_no
exports.updatePODetails = async (req, res) => {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if (err) {
            console.log("Unauthorized User :updatePODetail");
            res.send({ message: err.message });
        } else {
            console.log("Authorized User :updatePODetail");
            const pr_no = req.params.pr_no;
            try {
                const { po_no, po_date, po_update_by } = req.body;
                const po_attachment = req.file ? req.file.path : "";

                // Find existing PR
                const pr = await PurchaseRequisition.findOne({ where: { pr_no } });
                if (!pr) {
                    return res.send({ status: false, message: "Purchase Requisition not found" });
                }

                // Handle attachment update
                if (req.file && pr.po_attachment && pr.po_attachment !== po_attachment) {
                    try {
                        fs.unlinkSync(pr.po_attachment);
                    } catch (deleteErr) {
                        console.error("Failed to delete old PO attachment file:", deleteErr);
                    }
                }

                // Require attachment
                if (!req.file && !pr.po_attachment) {
                    return res.send({
                        status: false,
                        message: "File upload failed or file not exist. Purchase Requisition not updated."
                    });
                }

                // Update PO fields
                pr.po_no = po_no;
                pr.po_date = po_date;
                pr.po_update_by = po_update_by;
                if (po_attachment) pr.po_attachment = po_attachment;
                pr.pr_status = 5;
                await pr.save();

                let poUpdatedByUsername = '';
                if (po_update_by) {
                    const poUpdatedByAccount = await Account.findOne({ where: { account_id: po_update_by} });
                    if (poUpdatedByAccount) {
                        poUpdatedByUsername = poUpdatedByAccount.account_username;
                    }
                }

                //send email to requestor with the po attachment
                if (pr.requestor) {
                    // Find requestor email
                    const requestorAccount = await Account.findOne({ where: { account_id: pr.requestor } });
                    if (requestorAccount && requestorAccount.account_email) {
                        let mailOptions = {
                            from: "cargo-notification@billionprima.com.my",
                            to: requestorAccount.account_email,
                            subject: "PO Attachment for Purchase Requisition",
                            text: `The PO for your Purchase Requisition Number ${pr.pr_no} has been updated by ${poUpdatedByUsername}.`,
                        };
                        if (pr.po_attachment && fs.existsSync(pr.po_attachment)) {
                            mailOptions.attachments = [
                                {
                                    filename: pr.po_attachment.split(/[\\/]/).pop(),
                                    path: pr.po_attachment
                                }
                            ];
                        }
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error("Failed to send PO email to requestor:", error);
                            } else {
                                console.log("PO email sent to requestor:", info.response);
                            }
                        });
                    }
                }

                res.send({
                    status: true,
                    message: "PO detail updated successfully"
                });
            } catch (err) {
                // Delete uploaded file if it exists
                if (req.file && req.file.path) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (deleteErr) {
                        console.error("Failed to delete uploaded file:", deleteErr);
                    }
                }
                console.error("Error updating PO detail:", err);
                res.send({ status: false, message: "An error occurred while updating PO detail." });
            }
        }
    });
};

//to view file po attachment
exports.viewPOAttachment = async (req, res) => {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if (err) {
            console.log("Unauthorized User :viewPOAttachment");
            res.status(401).send({
                message:err.message
            });
        } else {
            console.log("Authorized User :viewPOAttachment");
            const pr_no = req.params.pr_no;
            try {
                const pr = await PurchaseRequisition.findOne({ where: { pr_no } });
                if (!pr || !pr.po_attachment) {
                    return res.send({ status: false, message: "Attachment not found" });
                }
                const filePath = pr.po_attachment;
                if (!fs.existsSync(filePath)) {
                    return res.send({ status:false, message: "File does not exist" });
                }
                res.sendFile(filePath);
            } catch (err) {
                console.error("Error viewing PO attachment:", err);
                res.send({ status:false,  message: "An error occurred while retrieving the attachment." });
            }
        }
    });
};

//get Pending Approval PR List
exports.getPendingApprovalPRList = async (req, res) => {
    let authToken = req.headers.authorization;

    jwt.verify(authToken, secretKey, async (err, user) => {
        if(err){
            console.log("Unauthorized User :getPendingApprovalPRList")
            res.status(401).send({
                message:err.message
            });
        }else{
            console.log("Authorized User :getPendingApprovalPRList")
            const { job_no, pr_no, pr_type } = req.query;
            const whereClause = {
                pr_status: 1,
            };
            //job_no want to use like with % before and after
            if (job_no) {
                whereClause.job_no = {
                    [Op.like]: `%${job_no}%`
                };
            }
            if (pr_no) { whereClause.pr_no = pr_no; }
            if (pr_type) { whereClause.pr_type = pr_type; }

            try {
                const pr =  await PurchaseRequisition.findAll({
                    attributes: ['job_no', 'pr_no', 'pr_type', 'pr_date', 'po_no', 'supplier_name', 'requestor', 'pr_status'],
                    include: [
                        {
                            model: Account,
                            as: 'pr_creator',
                            attributes: ['account_username']
                        },
                    ],
                    where: whereClause,
                    order: [['pr_date', 'DESC']]
                })

                res.send({
                    status: true,
                    pr,
                    message: "Successfully retrieved Pending Approval Purchase Requisition list"
                });
                
            } catch (err) {
                console.error("Error retrieving Pending Approval Purchase Requisition:", err);
                res.send({
                    status: false,
                    message: "An error occurred while retrieving Pending Approval Purchase Requisitions."
                });
            }
        }
    });
}

//get Store Checking PR List
exports.getStoreCheckingPRList = async (req, res) => {
    let authToken = req.headers.authorization;

    jwt.verify(authToken, secretKey, async (err, user) => {
        if(err){
            console.log("Unauthorized User :getStoreCheckingPRList")
            res.status(401).send({
                message:err.message
            });
        }else{
            console.log("Authorized User :getStoreCheckingPRList")
            const { job_no, pr_no } = req.query;
            const whereClause = {
                pr_status: 2,
            };
            //job_no want to use like with % before and after
            if (job_no) {
                whereClause.job_no = {
                    [Op.like]: `%${job_no}%`
                };
            }
            if (pr_no) { whereClause.pr_no = pr_no; }

            try {
                const pr =  await PurchaseRequisition.findAll({
                    attributes: ['job_no', 'pr_no', 'pr_type', 'pr_date', 'po_no', 'supplier_name', 'requestor', 'pr_status'],
                    include: [
                        {
                            model: Account,
                            as: 'pr_creator',
                            attributes: ['account_username']
                        },
                    ],
                    where: whereClause,
                    order: [['pr_date', 'DESC']]
                })

                res.send({
                    status: true,
                    pr,
                    message: "Successfully retrieved Store Checking Purchase Requisition list"
                });
                
            } catch (err) {
                console.error("Error retrieving Store Checking Purchase Requisition:", err);
                res.send({
                    status: false,
                    message: "An error occurred while retrieving Store Checking Purchase Requisitions."
                });
            }
        }
    });
}

//reject or approve pr - can be use for manager
exports.updateApprovalPR = async (req, res) => {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if (err) {
            console.log("Unauthorized User :updateApprovalPR");
            res.status(401).send({ message: err.message });
        }
        else{
            console.log("Authorized User :updateApprovalPR");
            const pr_no = req.params.pr_no;
            const { pr_status, remark, approver } = req.body; // pr_status: 3=Approved, 4=Rejected
            try {
                const pr = await PurchaseRequisition.findOne({ where: { pr_no } });
                if (!pr) {
                    return res.send({ status: false, message: "Purchase Requisition not found" });
                }
                pr.pr_status = pr_status;
                pr.pr_status_desc = remark? remark: "";
                await pr.save();

                let approvedByUsername = '';
                if (approver) {
                    const approvedByAccount = await Account.findOne({ where: { account_id: approver} });
                    if (approvedByAccount) {
                        approvedByUsername = approvedByAccount.account_username;
                    }
                }

                // Send notification email
                let recipients = [];
                let subject = "";
                let text = "";
                if (pr_status == 3) {
                    // Approved - notify requestor
                    subject = "Purchase Requisition Approved";
                    text = `Purchase Requisition Number ${pr_no} has been approved by ${approvedByUsername}.`;

                    //get accountant role 3 email and send together with the requestor
                    const accountants = await Account.findAll({ where: { account_role: 3 } });
                    accountants.forEach(acc => {
                        if (acc.account_email) {
                            recipients.push(acc.account_email);
                        }
                    });
                    const requestorAccount = await Account.findOne({ where: { account_id: pr.requestor } });
                    if (requestorAccount && requestorAccount.account_email) {
                        recipients.push(requestorAccount.account_email);
                    }
                } else if (pr_status == 4) {
                    // Rejected - notify requestor
                    subject = "Purchase Requisition Rejected";
                    text = `Your Purchase Requisition Number ${pr_no} has been rejected by ${approvedByUsername}.${remark ? " Remark: " + remark : ""}`;
                    const requestorAccount = await Account.findOne({ where: { account_id: pr.requestor } });
                    if (requestorAccount && requestorAccount.account_email) {
                        recipients.push(requestorAccount.account_email);
                    }
                }
                if (recipients.length > 0) {
                    transporter.sendMail({
                        from: "cargo-notification@billionprima.com.my",
                        to: recipients,
                        subject,
                        text,
                    });
                }

                // Log the action
                await Log.create({
                    pr_no: pr.pr_no,
                    log_user_id: approver,
                    log_datetime: formatDateTime(new Date()),
                    log_desc: `Purchase Requisition Number ${pr.pr_no} has been ${pr_status == 3 ? "approved" : "rejected"} by ${approvedByUsername}${remark ? ". Remark: " + remark : ""}`,
                });

                res.send({
                    status: true,
                    message: `Purchase Requisition has been ${pr_status == 3 ? "approved" : "rejected"} successfully`
                });
            } catch (err) {
                console.error("Error updating PR status:", err);
                res.send({
                    status: false,
                    message: "An error occurred while updating the Purchase Requisition status."
                });
            }
        }
    });
};

//check and approve pr - can be use for store keeper
exports.updateCheckPR = async (req, res)=> {
    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, async (err, user) => {
        if (err) {
            console.log("Unauthorized User :updateCheckPR");
            res.status(401).send({ message: err.message });
        }
        else{
            console.log("Authorized User :updateCheckPR");
            const pr_no = req.params.pr_no;
            const { currency, approver, items } = req.body;
            try {
                const pr = await PurchaseRequisition.findOne({ where: { pr_no } });
                if (!pr) {
                    return res.send({ status: false, message: "Purchase Requisition not found" });
                }
                pr.currency = currency;
                pr.pr_status = 3;
                await pr.save();

                let approvedByUsername = '';
                if (approver) {
                    const approvedByAccount = await Account.findOne({ where: { account_id: approver} });
                    if (approvedByAccount) {
                        approvedByUsername = approvedByAccount.account_username;
                    }
                }

                // Send notification email
                let recipients = [];
                let subject = "";
                let text = "";
                // Approved - notify requestor
                subject = "Purchase Requisition Approved";
                text = `Purchase Requisition Number ${pr_no} has been approved by ${approvedByUsername}.`;

                //update item_price where items consist of pr_item_id and item_price
                // console.log("items", items)
                if (Array.isArray(items)) {
                    for (const item of items) {
                        if (item.pr_item_id && item.item_price !== undefined) {
                            await PurchaseRequisitionItem.update(
                                { item_price: item.item_price },
                                { where: { pr_item_id: item.pr_item_id } }
                            );
                        }
                    }
                }
                //get the requestor email
                const requestorAccount = await Account.findOne({ where: { account_id: pr.requestor } });
                if (requestorAccount && requestorAccount.account_email) {
                    recipients.push(requestorAccount.account_email);
                }
                
                if (recipients.length > 0) {
                    transporter.sendMail({
                        from: "cargo-notification@billionprima.com.my",
                        to: recipients,
                        subject,
                        text,
                    });
                }

                // Log the action
                await Log.create({
                    pr_no: pr.pr_no,
                    log_user_id: approver,
                    log_datetime: formatDateTime(new Date()),
                    log_desc: `Purchase Requisition Number ${pr.pr_no} has been approved by ${approvedByUsername}`,
                });

                res.send({
                    status: true,
                    message: `Purchase Requisition has been approved successfully`
                });
            } catch (err) {
                console.error("Error updating PR status:", err);
                res.send({
                    status: false,
                    message: "An error occurred while updating the Purchase Requisition status."
                });
            }
        }
    });
};