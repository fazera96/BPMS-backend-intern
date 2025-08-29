const { where } = require('sequelize');
const db = require('../models');
const Account = db.account;
const Op = db.Sequelize.Op;
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

exports.findAllUser = (req, res) => {

  let authToken = req.headers.authorization;
  jwt.verify(authToken, secretKey, (err, user) => {
    if(err){
      console.log("Unauthorized User!:findAllUser")
            res.status(401).send({
                 message:err.message
               });
    }else{
      Account.findAll()
      .then(data => {
        res.send({
          data,
          message: `Successful Retrieve all user record`
      });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message 
        });
      });
    }

  });
   
};

exports.findUser = (req, res) => {

  let authToken = req.headers.authorization;
  jwt.verify(authToken, secretKey, (err, user) => {
    if(err){
      console.log("Unauthorized User!:findUser")
            res.status(401).send({
                 message:err.message
               });
    }else{
      const username = req.query.username
      Account.findAll({
          where : {
              account_username: {
                  [Op.like]: username
              }
          }
      })
      .then(data => {
       if(data.length==1){
        res.send({
          data,
          message: 'Successful Retrieve user record for ' + username
        })
       }else{
        res.send({
          data,
          message: 'No user record'
        })
       }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message 
        });
      });
    }
  });
}

exports.loginAccount = (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  Account.findAll({
    where:{
      account_username:{
        [Op.eq] : username
      },
      account_password:{
        [Op.eq] : password
      }
    }
  })
  .then(data => {
    if(data.length == 1){
      // Create a new token with the user data in the payload
      const token = jwt.sign({ data}, secretKey)
      res.send({
          data,
          token
      });
    }else{
      res.send({
        data: `No user data`,
        token: ''
     });
    }
  })
  .catch( err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving accounts."
    });
  })
}

exports.updateLoginTime = (req, res) => {
  const id = req.params.id;
  const today = new Date();
  
  // Format the date and time in 'YYYY-MM-DD HH:MM:SS' format using local time
  const date = today.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
  const time = today.toLocaleTimeString('it-IT'); // 'HH:MM:SS'

  const dateTime = `${date} ${time}`;

  Account.update({
      account_lastlogin: dateTime
  }, {
      where: { account_id: id }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              status: 1,
              message: "User was updated successfully."
          });
      } else {
          res.send({
              status: 0,
              message: `Cannot update User with id=${id}`
          });
      }
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
};

exports.updateLogoutTime = (req, res) => {
  const id = req.params.id;
  const today = new Date();
  
  // Format the date and time in 'YYYY-MM-DD HH:MM:SS' format using local time
  const date = today.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
  const time = today.toLocaleTimeString('it-IT'); // 'HH:MM:SS'

  const dateTime = `${date} ${time}`;

  Account.update({
      account_lastlogout: dateTime
  }, {
      where: { account_id: id }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              status: 1,
              message: "User was updated successfully."
          });
      } else {
          res.send({
              status: 0,
              message: `Cannot update User with id=${id}`
          });
      }
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
};

exports.createAccount = (req,res) => {
  let authToken = req.headers.authorization;

  jwt.verify(authToken, secretKey, (err,user) => {
    if(err){
      console.log("Unauthorized User!:createAccount")
      res.status(401).send({
           message:err.message
         });
    }else{
      
      const user = {
        account_username : req.body.username,
        account_password : req.body.password,
        account_role : req.body.role
      }

      Account.create(user)
      .then(data => {
        res.send({
          data,
          message: `Successful add user`,
        });
      })
      .catch( err => {
        console.log(err)
        res.status(500).send({
            message: err.message
        });

      })
    }
  })
}

exports.deleteAccount = (req,res) => {
  let authToken = req.headers.authorization;

  jwt.verify( authToken, secretKey , (err,user) =>{
    if(err){
      console.log("Unauthorized User!:deleteAccount")
      res.status(401).send({
           message:err.message
         });

    }else{
      const id = req.params.id;

      Account.destroy({
        where:{
          account_id:{
            [Op.eq]:id
          }
        }
      })
      .then(data => {
        if(data == 1){
          res.send({
            status : 1,
            message:'Sucessfully delete user account'
          })
        }else{
          res.send({
            status : 0,
            message:'Unsucessfully delete user account'
          })
        }
    
      })
      .catch( err => {
        console.log(err)
        res.status(500).send({
            message: err.message
        });
      })
    }
  })
 
}

exports.editAccount = (req,res) => {
    let authToken = req.headers.authorization;

    jwt.verify( authToken, secretKey, (err,user) => {
        if(err){
            console.log("Unauthorized User!:editAccount")
            res.status(401).send({
                message:err.message
            });
        }else{

            const id = req.params.id;

            const user = {
                account_username : req.body.username,
                account_password : req.body.password,
                account_role : req.body.role
            }

            Account.update(user ,{
                where:{
                    account_id:id
                }
            })
            .then( data => {
                if(data == 1){
                    res.send({
                        status : 1,
                        message : "Successfully update"
                    })
                }else{
                    res.send({
                        status : 0,
                        message : "Unsuccessfull update"
                    })
                }
            })
            .catch ( err => {
                res.status(500).send({
                    message: err.message
                });
            })
        }
    })
}