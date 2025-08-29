const nodemailer = require("nodemailer");
const db = require("../models");
const JobSpecs = db.jobSpecs;
const JobSpecsReq = db.jobSpecsReq;
const JobSpecsItem = db.jobSpecsItem;
const JobSpecsOthers = db.jobSpecsOthers;
const pcProgressReport = db.pcProgressReport;
const pcFinalReport = db.pcFinalReport;
const pcPdiReport = db.pcPdiReport;
const electricalDesign = db.electricalDesign;
const factoryAcceptance = db.factoryAcceptance;
const mechanicalAssembly = db.mechanicalAssembly;
const mechanicalDesign = db.mechanicaldesign;
const packagingDelivery = db.packagingDelivery;
const production = db.production;
const programmingTesting = db.programmingTesting;
const siteInstallation = db.siteInstallation;
const standardPartsOrder = db.standardPartsOrder;
const Account = db.account;
const Log = db.logs;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');

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

function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

exports.findAllProject = (req, res) => {
    let authToken = req.headers.authorization;
    console.log("auth", authToken);
    jwt.verify(authToken, secretKey, (err, user) => {
        if (err) {
            console.log("Unauthorized User!:findAllProject");
            res.status(401).send({
                message: err.message
            });
        } else {
            JobSpecs.findAll({
                include: [
                    {
                        model: Account,
                        as: 'issuer',
                        attributes: ['account_username']
                    },
                    {
                        model: Account,
                        as: 'modifier',
                        attributes: ['account_username']
                    }
                ],
                order: [
                    ['issue_date', 'DESC'],
                    ['job_no', 'DESC']
                ]
            })
            .then(data => {
                res.send({
                    data,
                    message: `Successful Retrieve all project record`
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
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

        const { year, month, job_no, job_status} = req.query;
        // const monthString = month.toString().padStart(2, '0');
        if (year && month) {
            whereClause.issue_date = {
                [Op.like]: `${year}-${month.toString().padStart(2, '0')}%`,
            };
        } else if (year) {
            whereClause.issue_date = {
                [Op.like]: `${year}-%`,
        };
        } else if (month) {
            whereClause.issue_date = {
                [Op.like]: `%-${month.toString().padStart(2, '0')}-%`,
            };
        }
  
        if (job_no) {
          whereClause.job_no = { [Op.eq]: job_no };
        }

        if (job_status) {
          whereClause.job_status = { [Op.eq]: job_status };
        }

        JobSpecs.findAll({
            include: [
                {
                    model: Account,
                    as: 'issuer',
                    attributes: ['account_username']
                },
                {
                    model: Account,
                    as: 'modifier',
                    attributes: ['account_username']
                }
            ],
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

//not used
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

            JobSpecs.update(user ,{
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

// exports.generateJobNumber = async (req,res) => {
//   const date = new Date();
//   const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
//   const monthLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
//   const month = monthLetters[date.getMonth()]; // Get the letter corresponding to the month

//   // Find the last job number created for the current year and month
//   const lastJob = await JobSpecs.findOne({
//       where: {
//           job_no: {
//               [Op.like]: `${year}${month}%`
//           }
//       },
//       order: [['job_no', 'DESC']]
//   });

//   let newAutoNumber = '01'; // Default auto-number

//   console.log("lastJob", lastJob)

//   if (lastJob) {
//       const lastJobNo = lastJob.job_no;
//       const lastAutoNumber = parseInt(lastJobNo.slice(-2), 10);
//       console.log("lastAutoNumber", lastAutoNumber)
//       newAutoNumber = ('0' + (lastAutoNumber + 1)).slice(-2); // Increment and format with leading zero
//       console.log("newAutoNumber", newAutoNumber)
//   }

//   res.send({ jobNumber: `${year}${month}${newAutoNumber}`, message: 'Successfully generated job number' });
// }

exports.createJobSpecs = async (req,res) => {
    let authToken = req.headers.authorization;
  
    jwt.verify(authToken, secretKey, async (err,user) => {
      if(err){
        console.log("Unauthorized User!:createJobSpecs")
        res.status(401).send({
             message:err.message
           });
      }else{
            try {

              const jobSpecsDetail = req.body;

              const promises = [];

              const date = new Date();
              const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
              const monthLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
              const month = monthLetters[date.getMonth()]; // Get the letter corresponding to the month

              // Find the last job number created for the current year and month
              const lastJob = await JobSpecs.findOne({
                where: {
                    job_no: {
                        [Op.like]: `${year}${month}%`
                    }
                },
                order: [['job_no', 'DESC']]
              });

              let newAutoNumber = '01'; // Default auto-number

              console.log("lastJob", lastJob)

              if (lastJob) {
                const lastJobNo = lastJob.job_no;
                const lastAutoNumber = parseInt(lastJobNo.slice(-2), 10);
                console.log("lastAutoNumber", lastAutoNumber)
                newAutoNumber = ('0' + (lastAutoNumber + 1)).slice(-2); // Increment and format with leading zero
                console.log("newAutoNumber", newAutoNumber)
              }

              var jobNumber = `${year}${month}${newAutoNumber}`;
              console.log('Job Number: ', jobNumber)

              //create job specs
              promises.push(JobSpecs.create({
                job_no: jobNumber,
                job_desc: jobSpecsDetail.job_desc,
                issue_date: jobSpecsDetail.issue_date,
                issue_by: jobSpecsDetail.issue_by,
                client_name: jobSpecsDetail.client_name,
                client_contact: jobSpecsDetail.client_contact,
                site_location: jobSpecsDetail.site_location,
                delivery_date: jobSpecsDetail.delivery_date,
                job_type: jobSpecsDetail.job_type,
                job_status: jobSpecsDetail.job_status
              }));

              jobSpecsDetail.job_requirement.forEach(requirement => {
                const jobSpecsReq = {
                    job_no: jobNumber,
                    requirement_desc: requirement
                };
                promises.push(JobSpecsReq.create(jobSpecsReq));
              });

              jobSpecsDetail.job_item.forEach(item => {
                  const jobSpecsItem = {
                      job_no: jobNumber,
                      item_desc: item
                  };
                  promises.push(JobSpecsItem.create(jobSpecsItem));
              });

              jobSpecsDetail.job_other.forEach(other => {
                  const jobSpecsOther = {
                      job_no: jobNumber,
                      others_desc: other
                  };
                  promises.push(JobSpecsOthers.create(jobSpecsOther));
              });

              if(jobSpecsDetail.job_type == 1) {
                //create PC reports
                promises.push(pcProgressReport.create({ job_no: jobNumber }));
                promises.push(pcFinalReport.create({ job_no: jobNumber }));
                promises.push(pcPdiReport.create({ job_no: jobNumber }));

                const electricalDesignDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.electrical_design.estimated_duration,
                    planned_start_date: jobSpecsDetail.electrical_design.planned_start_date,
                    remarks_schedule: jobSpecsDetail.electrical_design.remarks_schedule,
                    verified_by: jobSpecsDetail.electrical_design.verified_by,
                };
                promises.push(electricalDesign.create(electricalDesignDetail));

                const factoryAcceptanceDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.factory_acceptance.estimated_duration,
                    planned_start_date: jobSpecsDetail.factory_acceptance.planned_start_date,
                    remarks_schedule: jobSpecsDetail.factory_acceptance.remarks_schedule,
                    verified_by: jobSpecsDetail.factory_acceptance.verified_by,
                };
                promises.push(factoryAcceptance.create(factoryAcceptanceDetail));

                const mechanicalAssemblyDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.mechanical_assembly.estimated_duration,
                    planned_start_date: jobSpecsDetail.mechanical_assembly.planned_start_date,
                    remarks_schedule: jobSpecsDetail.mechanical_assembly.remarks_schedule,
                    verified_by: jobSpecsDetail.mechanical_assembly.verified_by,
                };
                promises.push(mechanicalAssembly.create(mechanicalAssemblyDetail));

                const mechanicalDesignDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.mechanical_design.estimated_duration,
                    planned_start_date: jobSpecsDetail.mechanical_design.planned_start_date,
                    remarks_schedule: jobSpecsDetail.mechanical_design.remarks_schedule,
                    verified_by: jobSpecsDetail.mechanical_design.verified_by,
                };
                promises.push(mechanicalDesign.create(mechanicalDesignDetail));

                const packagingDeliveryDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.package_delivery.estimated_duration,
                    planned_start_date: jobSpecsDetail.package_delivery.planned_start_date,
                    remarks_schedule: jobSpecsDetail.package_delivery.remarks_schedule,
                    verified_by: jobSpecsDetail.package_delivery.verified_by,
                };
                promises.push(packagingDelivery.create(packagingDeliveryDetail));

                const productionDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.production.estimated_duration,
                    planned_start_date: jobSpecsDetail.production.planned_start_date,
                    remarks_schedule: jobSpecsDetail.production.remarks_schedule,
                    verified_by: jobSpecsDetail.production.verified_by,
                };
                promises.push(production.create(productionDetail));

                const programmingTestingDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.programming_testing.estimated_duration,
                    planned_start_date: jobSpecsDetail.programming_testing.planned_start_date,
                    remarks_schedule: jobSpecsDetail.programming_testing.remarks_schedule,
                    verified_by: jobSpecsDetail.programming_testing.verified_by,
                };
                promises.push(programmingTesting.create(programmingTestingDetail));

                const siteInstallationDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.site_installation.estimated_duration,
                    planned_start_date: jobSpecsDetail.site_installation.planned_start_date,
                    remarks_schedule: jobSpecsDetail.site_installation.remarks_schedule,
                    verified_by: jobSpecsDetail.site_installation.verified_by,
                };
                promises.push(siteInstallation.create(siteInstallationDetail));

                const standardPartsOrderDetail = {
                    job_no: jobNumber,
                    estimated_duration: jobSpecsDetail.standard_parts_order.estimated_duration,
                    planned_start_date: jobSpecsDetail.standard_parts_order.planned_start_date,
                    remarks_schedule: jobSpecsDetail.standard_parts_order.remarks_schedule,
                    verified_by: jobSpecsDetail.standard_parts_order.verified_by,
                };
                promises.push(standardPartsOrder.create(standardPartsOrderDetail));
              }

              await Promise.all(promises);

            let issuedByUsername = '';
            if (jobSpecsDetail.issue_by) {
                const issuedByAccount = await Account.findOne({ where: { account_id: jobSpecsDetail.issue_by } });
                if (issuedByAccount) {
                    issuedByUsername = issuedByAccount.account_username;
                }
            }

            // Send email notification
            await Account.findAll(
            { where: { account_role: 5 } }
            ).then((data) => {
                if (data) {
                    data.forEach((user) => {
                    console.log("Email sent to:", user.account_email);
                    transporter.sendMail({
                        from: "cargo-notification@billionprima.com.my",
                        to: user.account_email,
                        subject: "New Job Specification Created",
                        text: `A new job specification has been created by ${issuedByUsername} with Job Number: ${jobNumber}`,
                    });
                    });
                }
            }).catch((error) => {
                console.error("Error fetching account email:", error);
            });

            await Log.create({
                job_no: jobNumber,
                log_user_id: jobSpecsDetail.issue_by,
                log_datetime: formatDateTime(new Date()),
                log_desc: `Job specs ${jobNumber} has been created by ${issuedByUsername}`,
            }).then(() => {
                console.log("Log created successfully");
            }).catch((error) => {
                console.error("Error creating log:", error);
            });

            res.send({
                job_number: jobNumber,
                message: `Successfully created job specs and related records`
            });
          } catch (err) {
              console.log(err);
              res.status(500).send({
                  message: err.message
              });
          }
      }
    })
}

exports.getDetailJobSpecsByJobNumber = async (req, res) => {
  const jobNumber = req.params.job_no;

  try {
    const jobSpecs = await JobSpecs.findOne({
        include: [
            {
                model: Account,
                as: 'issuer',
                attributes: ['account_username']
            },
            {
                model: Account,
                as: 'modifier',
                attributes: ['account_username']
            }
        ],
        where: { job_no: jobNumber } 
    });
      if (!jobSpecs) {
          return res.status(404).send({ message: `No job specs found with job number ${jobNumber}` });
      }

      const jobRequirements = await JobSpecsReq.findAll({ where: { job_no: jobNumber } });
      const jobItems = await JobSpecsItem.findAll({ where: { job_no: jobNumber } });
      const jobOthers = await JobSpecsOthers.findAll({ where: { job_no: jobNumber } });
      const progressReport = await pcProgressReport.findOne({ where: { job_no: jobNumber } });
      const finalReport = await pcFinalReport.findOne({ where: { job_no: jobNumber } });
      const pdiReport = await pcPdiReport.findOne({ where: { job_no: jobNumber } });
      const electricalDesignDetail = await electricalDesign.findOne({ where: { job_no: jobNumber } });
      const factoryAcceptanceDetail = await factoryAcceptance.findOne({ where: { job_no: jobNumber } });
      const mechanicalAssemblyDetail = await mechanicalAssembly.findOne({ where: { job_no: jobNumber } });
      const mechanicalDesignDetail = await mechanicalDesign.findOne({ where: { job_no: jobNumber } });
      const packagingDeliveryDetail = await packagingDelivery.findOne({ where: { job_no: jobNumber } });
      const productionDetail = await production.findOne({ where: { job_no: jobNumber } });
      const programmingTestingDetail = await programmingTesting.findOne({ where: { job_no: jobNumber } });
      const siteInstallationDetail = await siteInstallation.findOne({ where: { job_no: jobNumber } });
      const standardPartsOrderDetail = await standardPartsOrder.findOne({ where: { job_no: jobNumber } });

      res.send({
          jobSpecs,
          jobRequirements,
          jobItems,
          jobOthers,
          progressReport,
          finalReport,
          pdiReport,
          electricalDesignDetail,
          factoryAcceptanceDetail,
          mechanicalAssemblyDetail,
          mechanicalDesignDetail,
          packagingDeliveryDetail,
          productionDetail,
          programmingTestingDetail,
          siteInstallationDetail,
          standardPartsOrderDetail
      });
  } catch (err) {
      console.log(err);
      res.status(500).send({
          message: err.message
      });
  }
};

// New function to get job specs and related records by job number without associations
exports.getEditJobSpecsByJobNumber = async (req, res) => {
  const jobNumber = req.params.job_no;

  try {
    const jobSpecs = await JobSpecs.findOne({
        include: [
            {
                model: Account,
                as: 'issuer',
                attributes: ['account_username']
            },
            {
                model: Account,
                as: 'modifier',
                attributes: ['account_username']
            }
        ],
        where: { job_no: jobNumber } 
    });
      if (!jobSpecs) {
          return res.status(404).send({ message: `No job specs found with job number ${jobNumber}` });
      }

      const jobRequirements = await JobSpecsReq.findAll({ where: { job_no: jobNumber } });
      const jobItems = await JobSpecsItem.findAll({ where: { job_no: jobNumber } });
      const jobOthers = await JobSpecsOthers.findAll({ where: { job_no: jobNumber } });
      const progressReport = await pcProgressReport.findOne({ where: { job_no: jobNumber } });
      const finalReport = await pcFinalReport.findOne({ where: { job_no: jobNumber } });
      const pdiReport = await pcPdiReport.findOne({ where: { job_no: jobNumber } });
      const electricalDesignDetail = await electricalDesign.findOne({ where: { job_no: jobNumber } });
      const factoryAcceptanceDetail = await factoryAcceptance.findOne({ where: { job_no: jobNumber } });
      const mechanicalAssemblyDetail = await mechanicalAssembly.findOne({ where: { job_no: jobNumber } });
      const mechanicalDesignDetail = await mechanicalDesign.findOne({ where: { job_no: jobNumber } });
      const packagingDeliveryDetail = await packagingDelivery.findOne({ where: { job_no: jobNumber } });
      const productionDetail = await production.findOne({ where: { job_no: jobNumber } });
      const programmingTestingDetail = await programmingTesting.findOne({ where: { job_no: jobNumber } });
      const siteInstallationDetail = await siteInstallation.findOne({ where: { job_no: jobNumber } });
      const standardPartsOrderDetail = await standardPartsOrder.findOne({ where: { job_no: jobNumber } });

      res.send({
          jobSpecs,
          jobRequirements,
          jobItems,
          jobOthers,
          progressReport,
          finalReport,
          pdiReport,
          electricalDesignDetail,
          factoryAcceptanceDetail,
          mechanicalAssemblyDetail,
          mechanicalDesignDetail,
          packagingDeliveryDetail,
          productionDetail,
          programmingTestingDetail,
          siteInstallationDetail,
          standardPartsOrderDetail
      });
  } catch (err) {
      console.log(err);
      res.status(500).send({
          message: err.message
      });
  }
};

exports.saveEditedJobSpecs = async (req, res) => {
  let authToken = req.headers.authorization;

  jwt.verify(authToken, secretKey, async (err, user) => {
      if (err) {
          console.log("Unauthorized User!:saveEditedJobSpecs");
          res.status(401).send({
              message: err.message
          });
      } else {
          try {
              const jobNumber = req.params.job_no;
              const jobSpecsDetail = req.body;

              const existingJobSpecs = await JobSpecs.findOne({ where: { job_no: jobNumber } });
              if (!existingJobSpecs) {
                  return res.status(404).send({ message: `No job specs found with job number ${jobNumber}` });
              }

              // Update job specs
              await JobSpecs.update(jobSpecsDetail, { where: { job_no: jobNumber } });

              // Update job requirements
              const jobRequirementsPromises = jobSpecsDetail.job_requirement.map(requirement => {
                if (requirement.requirement_id) {
                    return JobSpecsReq.update(requirement, { where: { requirement_id: requirement.requirement_id } });
                } else {
                    return JobSpecsReq.create({
                        job_no: jobNumber,
                        requirement_desc: requirement.requirement_desc
                    });
                }
              });

              // Update job items
              const jobItemsPromises = jobSpecsDetail.job_item.map(item => {
                  if (item.item_id) {
                      return JobSpecsItem.update(item, { where: { item_id: item.item_id } });
                  } else {
                      return JobSpecsItem.create({
                          job_no: jobNumber,
                          item_desc: item.item_desc
                      });
                  }
              });

              // Update job others
              const jobOthersPromises = jobSpecsDetail.job_other.map(other => {
                  if (other.others_id) {
                      return JobSpecsOthers.update(other, { where: { others_id: other.others_id } });
                  } else {
                      return JobSpecsOthers.create({
                          job_no: jobNumber,
                          others_desc: other.others_desc
                      });
                  }
              });

              // Update PC reports if job type is 1
              const pcReportsPromises = [];
              if (jobSpecsDetail.job_type == 1) {

                  const electricalDesignDetail = {
                      electricaldesign_id: jobSpecsDetail.electrical_design.electricaldesign_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.electrical_design.estimated_duration,
                      planned_start_date: jobSpecsDetail.electrical_design.planned_start_date,
                      remarks_schedule: jobSpecsDetail.electrical_design.remarks_schedule,
                      verified_by: jobSpecsDetail.electrical_design.verified_by,
                  };
                  pcReportsPromises.push(electricalDesign.upsert(electricalDesignDetail));

                  const factoryAcceptanceDetail = {
                      factoryacceptance_id: jobSpecsDetail.factory_acceptance.factoryacceptance_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.factory_acceptance.estimated_duration,
                      planned_start_date: jobSpecsDetail.factory_acceptance.planned_start_date,
                      remarks_schedule: jobSpecsDetail.factory_acceptance.remarks_schedule,
                      verified_by: jobSpecsDetail.factory_acceptance.verified_by,
                  };
                  pcReportsPromises.push(factoryAcceptance.upsert(factoryAcceptanceDetail));

                  const mechanicalAssemblyDetail = {
                      mechanicalassembly_id: jobSpecsDetail.mechanical_assembly.mechanicalassembly_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.mechanical_assembly.estimated_duration,
                      planned_start_date: jobSpecsDetail.mechanical_assembly.planned_start_date,
                      remarks_schedule: jobSpecsDetail.mechanical_assembly.remarks_schedule,
                      verified_by: jobSpecsDetail.mechanical_assembly.verified_by,
                  };
                  pcReportsPromises.push(mechanicalAssembly.upsert(mechanicalAssemblyDetail));

                  const mechanicalDesignDetail = {
                      mechanicaldesign_id: jobSpecsDetail.mechanical_design.mechanicaldesign_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.mechanical_design.estimated_duration,
                      planned_start_date: jobSpecsDetail.mechanical_design.planned_start_date,
                      remarks_schedule: jobSpecsDetail.mechanical_design.remarks_schedule,
                      verified_by: jobSpecsDetail.mechanical_design.verified_by,
                  };
                  pcReportsPromises.push(mechanicalDesign.upsert(mechanicalDesignDetail));

                  const packagingDeliveryDetail = {
                      packagingdelivery_id: jobSpecsDetail.package_delivery.packagingdelivery_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.package_delivery.estimated_duration,
                      planned_start_date: jobSpecsDetail.package_delivery.planned_start_date,
                      remarks_schedule: jobSpecsDetail.package_delivery.remarks_schedule,
                      verified_by: jobSpecsDetail.package_delivery.verified_by,
                  };
                  pcReportsPromises.push(packagingDelivery.upsert(packagingDeliveryDetail));

                  const productionDetail = {
                      production_id: jobSpecsDetail.production.production_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.production.estimated_duration,
                      planned_start_date: jobSpecsDetail.production.planned_start_date,
                      remarks_schedule: jobSpecsDetail.production.remarks_schedule,
                      verified_by: jobSpecsDetail.production.verified_by,
                  };
                  pcReportsPromises.push(production.upsert(productionDetail));

                  const programmingTestingDetail = {
                      programmingtesting_id: jobSpecsDetail.programming_testing.programmingtesting_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.programming_testing.estimated_duration,
                      planned_start_date: jobSpecsDetail.programming_testing.planned_start_date,
                      remarks_schedule: jobSpecsDetail.programming_testing.remarks_schedule,
                      verified_by: jobSpecsDetail.programming_testing.verified_by,
                  };
                  pcReportsPromises.push(programmingTesting.upsert(programmingTestingDetail));

                  const siteInstallationDetail = {
                      siteinstallation_id: jobSpecsDetail.site_installation.siteinstallation_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.site_installation.estimated_duration,
                      planned_start_date: jobSpecsDetail.site_installation.planned_start_date,
                      remarks_schedule: jobSpecsDetail.site_installation.remarks_schedule,
                      verified_by: jobSpecsDetail.site_installation.verified_by,
                  };
                  pcReportsPromises.push(siteInstallation.upsert(siteInstallationDetail));

                  const standardPartsOrderDetail = {
                      standardpartorder_id: jobSpecsDetail.standard_parts_order.standardpartorder_id,
                      job_no: jobNumber,
                      estimated_duration: jobSpecsDetail.standard_parts_order.estimated_duration,
                      planned_start_date: jobSpecsDetail.standard_parts_order.planned_start_date,
                      remarks_schedule: jobSpecsDetail.standard_parts_order.remarks_schedule,
                      verified_by: jobSpecsDetail.standard_parts_order.verified_by,
                  };
                  pcReportsPromises.push(standardPartsOrder.upsert(standardPartsOrderDetail));
              }

              await Promise.all([
                  ...jobRequirementsPromises,
                  ...jobItemsPromises,
                  ...jobOthersPromises,
                  ...pcReportsPromises
              ]);

            let modifiedByUsername = '';
            if (jobSpecsDetail.modified_by) {
                const modifiedByAccount = await Account.findOne({ where: { account_id: jobSpecsDetail.modified_by } });
                if (modifiedByAccount) {
                    modifiedByUsername = modifiedByAccount.account_username;
                }
            }

              // Send email notification
            if (jobSpecsDetail.job_status === 1) {
                await Account.findAll(
                { where: { account_role: 5 } }
                ).then((data) => {
                    if (data) {
                        data.forEach((user) => {
                        console.log("Email sent to:", user.account_email);
                        transporter.sendMail({
                            from: "cargo-notification@billionprima.com.my",
                            to: user.account_email,
                            subject: "Job Specification Edited Notification",
                            text: `A job specification with Job Number: ${jobNumber} has been edited by ${modifiedByUsername}`,
                        });
                        });
                    }
                }).catch((error) => {
                    console.error("Error fetching account email:", error);
                });
            }

                await Log.create({
                    job_no: jobNumber,
                    log_user_id: jobSpecsDetail.modified_by,
                    log_datetime: formatDateTime(new Date()),
                    log_desc: `Job specs ${jobNumber} has been edited by ${modifiedByUsername}`,
                }).then(() => {
                    console.log("Log created successfully");
                }).catch((error) => {
                    console.error("Error creating log:", error);
                });

              res.send({
                  message: `Successfully updated job specs and related records`
              });
          } catch (err) {
              console.log(err);
              res.status(500).send({
                  message: err.message
              });
          }
     }
  });
};

exports.approvalJobSpecs = async (req, res) => {
  let authToken = req.headers.authorization;

  jwt.verify(authToken, secretKey, async (err, user) => {
      if (err) {
          console.log("Unauthorized User!:approvalJobSpecs");
          res.status(401).send({
              message: err.message
          });
      } else {
          try {
              const jobNumber = req.params.job_no;
              const { job_status, issued_by, approved_by, job_status_desc} = req.body;
              console.log(req.body)

              const jobSpecs = await JobSpecs.findOne({ where: { job_no: jobNumber } });
              if (!jobSpecs) {
                  return res.status(404).send({ message: `No job specs found with job number ${jobNumber}` });
              }

              //get approver username
              let approverByUsername = '';
            if (approved_by) {
                const approverByAccount = await Account.findOne({ where: { account_id: approved_by } });
                if (approverByAccount) {
                    // approverByUsername = modifiedByAccount.account_username;
                    approverByUsername = approverByAccount.account_username;
                }
            }

              await JobSpecs.update(
                  { job_status: job_status , job_status_desc: job_status_desc},
                  { where: { job_no: jobNumber } }
              ).then(async () => {
                  console.log("Job specs updated successfully");
                  try {
                    await Account.findOne(
                        { where: { account_id: issued_by } }
                      ).then((data) => {
                        if (data) {
                          console.log("data", data.account_email);
                          console.log("Email sent to:", data.account_email);

                            transporter.sendMail({
                              from: "cargo-notification@billionprima.com.my",
                              to: data.account_email,
                              subject: "Job Specification Approval Notification",
                              text: job_status == 2?`Job specs ${jobNumber} has been approved by ${approverByUsername}`:`Job specs ${jobNumber} has been rejected by ${approverByUsername}. The reason for rejection is ${job_status_desc}`,
                            });

                        } else {
                          console.log("No account found with the given username");
                        }
                      })
                      .catch((error) => {
                            console.error("Error fetching account email:", error);
                      });

                    await Log.create({
                        job_no: jobNumber,
                        log_user_id: approved_by,
                        log_datetime: formatDateTime(new Date()),
                        log_desc: job_status == 2?`Job specs ${jobNumber} has been approved by ${approverByUsername}`:`Job specs ${jobNumber} has been rejected by ${approverByUsername}`,
                    }).then(() => {
                        console.log("Log created successfully");
                    }).catch((error) => {
                        console.error("Error creating log:", error);
                    });
                  }catch (error) {
                      console.error("Error: ", error);
                  }
                  
              }).catch((error) => {
                  console.error("Error updating job specs:", error);
              });
              
              res.send({
                  message: `Successfully approved job specs`
              });

          } catch (err) {
              console.log(err);
              res.status(500).send({
                  message: err.message
              });
          }
      }
  });
};

//changestatustodeleted
exports.deleteJobSpecs= (req,res) =>{
    let authToken = req.headers.authorization;

    jwt.verify( authToken, secretKey, (err,user) => {
        if(err){
            console.log("Unauthorized User!:deleteJobSpec")
            res.status(401).send({
                message:err.message
            });
        }else{

           const jobNumber = req.params.job_no;

            const jobSpec = {
                job_status : 4
            }

            JobSpecs.update(jobSpec ,{
                where:{
                    job_no:jobNumber
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

