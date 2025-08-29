module.exports = app => {

    const Account = require('../controllers/account.controller');
    var router = require("express").Router();

    // Retrieve all Account
    router.get("/", Account.findAllUser);

    // Retrieve a one Account
    router.get("/username", Account.findUser);

    router.get('/login', Account.loginAccount);

    router.post('/createUser' , Account.createAccount);

    router.delete('/deleteUser/:id', Account.deleteAccount);

    router.put('/editUser/:id' , Account.editAccount)

    router.put('/update-lastLogin/:id', Account.updateLoginTime);

    router.put('/update-lastLogout/:id', Account.updateLogoutTime);
    
    app.use('/api/account', router);

}