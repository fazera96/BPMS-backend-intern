module.exports = app => {
    const JobSpecs = require('../controllers/jobSpecs.controller');
    var router = require("express").Router();

    // Retrieve all Account
    router.get("/", JobSpecs.findAllProject);
    // router.get('/generate-job-no', JobSpecs.generateJobNumber);
    router.put('/editProject/:id' , JobSpecs.editProject);//not used?
    router.get("/filter", JobSpecs.findProjectFilter);
    router.post('/create' , JobSpecs.createJobSpecs);
    router.get('/get-details/:job_no', JobSpecs.getDetailJobSpecsByJobNumber);
    router.get('/get-edit-details/:job_no', JobSpecs.getEditJobSpecsByJobNumber);
    router.put('/save-edit-job/:job_no', JobSpecs.saveEditedJobSpecs);
    router.put('/approval-job/:job_no', JobSpecs.approvalJobSpecs);
    router.put('/delete-job/:job_no', JobSpecs.deleteJobSpecs);
    
    app.use('/api/job-specs', router);

}