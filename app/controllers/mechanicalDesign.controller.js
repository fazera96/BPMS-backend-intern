const { where } = require('sequelize');
const db = require('../models');
const MechanicalDesign = db.mechanicaldesign;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

exports.findMechanical = (req,res) =>{

    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, (err, user) => {
      if(err){
        console.log("Unauthorized User!:findMechanical")
              res.status(401).send({
                   message:err.message
                 });
      }else{

        const job_no = req.params.jobNo;

        MechanicalDesign.findAll({
           where : {
              job_no: {
                  [Op.eq]: job_no
              }
          }
        })
        .then(data => {
          res.send({
            data,
            message: `Successful Retrieve MechanicalDesign record`
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
}

exports.editProject = (req,res) =>{
    let authToken = req.headers.authorization;

    jwt.verify( authToken, secretKey, (err,user) => {
        if(err){
            console.log("Unauthorized User!:editProject")
            res.status(401).send({
                message:err.message
            });
        }else{

            const id = req.params.id;

            const user = {
                job_no : req.body.job_no,
                project_name : req.body.project_name,
                date_of_commerce : req.body.date
            }

            Project.update(user ,{
                where:{
                    project_id:id
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

exports.addMechanicalDesign = (req,res) => {
    let authToken = req.headers.authorization;
  
    jwt.verify(authToken, secretKey, (err,user) => {
      if(err){
        console.log("Unauthorized User!:addMechanicalDesign")
        res.status(401).send({
             message:err.message
           });
      }else{
        
        const mechanicalDesign = {
          job_no : req.body.job_no,
          job_status : req.body.job_status,
          overall_progress : req.body.overall_progress,
          progress_percent : req.body.progress_percent
        }
  
        MechanicalDesign.create(mechanicalDesign)
        .then(data => {
          res.send({
            data,
            message: `Successful add MechanicalDesign`,
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