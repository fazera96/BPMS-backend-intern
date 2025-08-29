const { where } = require('sequelize');
const db = require('../models');
const RemarksDesc = db.remarksdesc;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

exports.findAllProject = (req,res) =>{

    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, (err, user) => {
      if(err){
        console.log("Unauthorized User!:findAllProject")
              res.status(401).send({
                   message:err.message
                 });
      }else{
        Project.findAll()
        .then(data => {
          res.send({
            data,
            message: `Successful Retrieve all project record`
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

exports.findProjectFilter = (req,res) =>{

    let authToken = req.headers.authorization;
    jwt.verify(authToken, secretKey, (err, user) => {
      if(err){
        console.log("Unauthorized User!:findProjectFilter")
              res.status(401).send({
                   message:err.message
                 });
      }else{
        let whereClause = {};

        const { year, month, job_no } = req.query;
  
        // Adding conditions to the whereClause based on query parameters
        if (year!="" && month!="") {
          whereClause[Op.and] = [
            Sequelize.where(
              Sequelize.fn('MONTH', Sequelize.col('date_of_commerce')),
              {
                [Op.eq]: month
              }
            ),
            Sequelize.where(
              Sequelize.fn('YEAR', Sequelize.col('date_of_commerce')),
              {
                [Op.eq]: year
              }
            )
          ];
        }

        if(year) {
            whereClause[Op.and] = [
                Sequelize.where(
                  Sequelize.fn('YEAR', Sequelize.col('date_of_commerce')),
                  {
                    [Op.eq]: year
                  }
                )
              ];
        }
  
        if (job_no) {
          whereClause.job_no = { [Op.eq]: job_no };
        }


        Project.findAll({
            where : whereClause
        })
        .then(data => {
          res.send({
            data,
            message: `Successful Retrieve project with filter`
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

exports.addRemarksDesc = (req,res) => {
    let authToken = req.headers.authorization;
  
    jwt.verify(authToken, secretKey, (err,user) => {
      if(err){
        console.log("Unauthorized User!:addRemarksDesc")
        res.status(401).send({
             message:err.message
           });
      }else{
        
        const remarks = {
          job_no : req.body.job_no,
          description : req.body.description,
          date : req.body.date,
          activities_category : req.body.activities_category
        }
  
        RemarksDesc.create(remarks)
        .then(data => {
          res.send({
            data,
            message: `Successful add remarks desc`,
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