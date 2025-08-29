
module.exports = app => {
    const PurchaseRequisition = require('../controllers/purchaseRequisition.controller');
    var router = require("express").Router();
    const multer = require('multer');
    const path = require('path');
    const fs = require('fs');
    require('dotenv').config();

    
    let uploadDirPR;
    let uploadDirPO;
    if (process.env.NODE_ENV !== "development"){
        uploadDirPR = '/uploads/Attachment/PR/';
        uploadDirPO = '/uploads/Attachment/PO/';
    }
    else {
        uploadDirPR = process.env.PATH_ATTH_DEV +'/uploads/Attachment/PR/';
        uploadDirPO = process.env.PATH_ATTH_DEV + '/uploads/Attachment/PO/';
    }

    // // Ensure upload directory PR exists
    // if (!fs.existsSync(uploadDirPR)) {
    //     fs.mkdirSync(uploadDirPR, { recursive: true });
    // }

    // // Configure storage PR
    // // const storagePR = multer.diskStorage({
    // //     destination: function (req, file, cb) {
    // //         cb(null, uploadDirPR);
    // //     },
    // //     filename: function (req, file, cb) {
    // //         cb(null, Date.now() + path.extname(file.originalname));
    // //     }
    // // });

    const storagePR = multer.diskStorage({
        destination: function (req, file, cb) {

            // Use pr_date or today (if pr_date not available)
            let prDate = req.body.pr_date ? new Date(req.body.pr_date) : new Date();
            let year = String(prDate.getFullYear());  
            let month = String(prDate.getMonth() + 1).padStart(2, '0'); 
            let day = String(prDate.getDate()).padStart(2, '0');

            // Build folder path
            let folderPath = path.join(uploadDirPR, year, month, day);

            // Ensure folder exists
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            cb(null, folderPath);
        },

        filename: function (req, file, cb) {
            // Use timestamp + original extension for unique filename
            cb(null, Date.now() + path.extname(file.originalname));
        }

        // filename PR_date_time
        // filename: function (req, file, cb) {
        //     let now = new Date();
            
        //     // Build date-time string YYYYMMDD_HHMMSS
        //     let dateTime = 
        //         String(now.getFullYear()) +
        //         String(now.getMonth() + 1).padStart(2, '0') +
        //         String(now.getDate()).padStart(2, '0') + '_' +
        //         String(now.getHours()).padStart(2, '0') +
        //         String(now.getMinutes()).padStart(2, '0') +
        //         String(now.getSeconds()).padStart(2, '0');

        //     let ext = path.extname(file.originalname);

        //     cb(null, `PR_${dateTime}${ext}`);
        // }
    });

    const uploadPR = multer({ storage: storagePR });


    //  // Ensure upload directory PO exists
    // if (!fs.existsSync(uploadDirPO)) {
    //     fs.mkdirSync(uploadDirPO, { recursive: true });
    // }

    // // Configure storage PR
    // const storagePO = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, uploadDirPO);
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, Date.now() + path.extname(file.originalname));
    //     }
    // });

    const storagePO = multer.diskStorage({
        destination: function (req, file, cb) {

            // Use po_date or today (if po_date not available)
            let poDate = req.body.po_date ? new Date(req.body.po_date) : new Date();
            let year = String(poDate.getFullYear());  
            let month = String(poDate.getMonth() + 1).padStart(2, '0'); 
            let day = String(poDate.getDate()).padStart(2, '0');

            // Build folder path
            let folderPath = path.join(uploadDirPO, year, month, day);

            // Ensure folder exists
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            cb(null, folderPath);
        },

        filename: function (req, file, cb) {
            // Use timestamp + original extension for unique filename
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    const uploadPO = multer({ storage: storagePO });
    
    router.get("/get-job-no", PurchaseRequisition.getJobNo);
    router.post('/create-pr', uploadPR.single('file'), PurchaseRequisition.createPR);
    router.get('/get-pr-list', PurchaseRequisition.getPRList);
    router.get('/get-pr-details/:pr_no', PurchaseRequisition.getPRDetails);
    router.get('/get-update-pr-details/:pr_no', PurchaseRequisition.getUpdatePRDetails);
    router.put('/update-pr-details/:pr_no', uploadPR.single('file'), PurchaseRequisition.updatePRDetails);
    router.get('/get-pr-attachment/:pr_no', PurchaseRequisition.viewPRAttachment);
    router.get('/get-po-details/:pr_no',PurchaseRequisition.getPODetails);
    router.put('/update-po/:pr_no', uploadPO.single('file'), PurchaseRequisition.updatePODetails);
    router.get('/get-po-attachment/:pr_no', PurchaseRequisition.viewPOAttachment);
    router.get('/get-pending-approval-pr-list', PurchaseRequisition.getPendingApprovalPRList);
    router.get('/get-store-checking-pr-list', PurchaseRequisition.getStoreCheckingPRList);
    router.put('/update-approval-pr/:pr_no', PurchaseRequisition.updateApprovalPR);
    router.put('/update-check-pr/:pr_no',PurchaseRequisition.updateCheckPR);

    app.use('/api/pr', router);
}