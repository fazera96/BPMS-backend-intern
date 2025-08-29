module.exports = app => {

    const MechanicalDesign = require('../controllers/mechanicalDesign.controller');
    var router = require("express").Router();

    // Retrieve all Account
    router.get("/findProject/:jobNo", MechanicalDesign.findMechanical);
    //router.put('/editProject/:id' , Project.editProject);
    //router.get("/filter", Project.findProjectFilter);
    router.post('/addProject' , MechanicalDesign.addMechanicalDesign);
    
    app.use('/api/mechanicalDesign', router);

}