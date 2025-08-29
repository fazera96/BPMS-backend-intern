module.exports = app => {

    const RemarksDesc = require('../controllers/mechanicalDesign.controller');
    var router = require("express").Router();

    // Retrieve all Account
    router.get("/", Project.findAllProject);
    router.put('/editProject/:id' , Project.editProject);
    router.get("/filter", Project.findProjectFilter);
    router.post('/addRemarkDesc' , RemarksDesc.a);
    
    app.use('/api/remarksDesc', router);

}