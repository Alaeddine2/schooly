const express = require("express");
const adminSchema = require("../../schemas/actors/admin_schema");
const authSchema = require("../../schemas/auth_schema");
const tokenSchema = require("../../schemas/token_schema");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const utils = require("../../utils/util_methods");
const constants = require("../../utils/constants");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send('test route');
});

// Retrieve all admins
router.post("/retrieve/", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      adminSchema.find((err, adminList) => {
        if (err) {
          console.log(err);
        } else {
          res.json({ adminList });
        }
      });
    });
});

// Retrieve admin  by ID
router.post("/retrieve/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      let id = req.params.id;
      adminSchema
        .find({ _id: id })
        .exec()
        .then((adminList) => {
          if (adminList.length < 1) {
            return res.status(401).json({
              message: "ID not found!",
            });
          }
          if (adminList) {
            res.json(adminList[0]);
          }
        });
    });
});

// Retrieve admin  by ID
router.post("/retrieveList", utils.extractToken, (req, res) => {
    tokenSchema
        .find({ token: req.token })
        .exec()
        .then((resultList) => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token",
                });
            }
            console.log(req.body.list);
            // let id = req.params.id;
            adminSchema
                .find({ _id : { $in : req.body.list } })
                .exec()
                .then((adminList) => {
                    if (adminList.length < 1) {
                        return res.status(401).json({
                            message: "ID not found!",
                        });
                    }
                    if (adminList) {
                        res.json(adminList);
                    }
                });
        });
});

//Add new admin
router.post("/add", (req, res) => {
  console.log(req.body.name);
  adminSchema.find(
    { $or: [{ nic: req.body.username }, { phone: req.body.phone }] },
    function (err, matchingAdmins) {
      //console.log(matchingAdmins);
      if (matchingAdmins.length >= 1) {
        console.log(matchingAdmins);
        res.status(409).send({
          message: "admin already exists",
        });
      } else {
        const hash = bcrypt.hashSync(req.body.password, 8);
        const newObjectID = mongoose.Types.ObjectId();
        const adminModel = new adminSchema({
          objectId: newObjectID,
          nic: req.body.username,
          email: req.body.email,
          name: req.body.name,
          surname: req.body.surname,
          cin: req.body.cin,
          phone: req.body.phone,
        });
        const authModel = new authSchema({
          user_id: newObjectID,
          nic: req.body.username,
          phone: req.body.phone,
          user_type: constants.USER_TYPE_ADMIN,
          password_hash: hash,
        });
        authModel.save().catch((err) => {
          console.log(err.message);
          res.status(500).json({
            error: err,
          });
        });
        adminModel
          .save()
          .then((result) => {
            //console.log(result);
            res.status(201).json({
              message: "admin added",
              data: result,
            });
          })
          .catch((err) => {
            console.log(err.message);
            res.status(500).json({
              message: "Adding new admin failed",
              error: err,
            });
          });
      }
    }
  );
});

//update
router.post("/update/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      adminSchema
        .update({ _id: req.params.id }, req.body)
        .then((result) => {
          res.status(200).json({
            message: "Updated successfully",
            createdParent: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Updating failed",
            error: err,
          });
        });
    });
});

router.post("/delete/:id", utils.extractToken, (req, res) => {
  tokenSchema
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      adminSchema.findOneAndDelete({ _id: req.params.id }, (err, admin) => {
        if (err) {
          res.json(err);
        } else {
          authSchema.findOneAndDelete(
            { user_id: req.params.id },
            (err, admin) => {
              if (err) {
                res.json(err);
              } else {
                tokenSchema.findOneAndDelete(
                  { user_id: req.params.id },
                  (err, admin) => {
                    if (err) {
                      res.json(err);
                    } else {
                      res.json("deleted successfully");
                    }
                  }
                );
              }
            }
          );
        }
      });
    });
});

router.post("/find", (req, res) => {
  var name = req.body.name;
  var query = {};
  query[name] = { $regex: req.body.value };
  adminSchema
    .find(query)
    .exec()
    .then((resultList) => {
      if (resultList) {
        res.json(resultList);
      }
    });
});

module.exports = router;
