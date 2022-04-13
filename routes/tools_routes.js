
const express = require("express");
const utils = require("../utils/util_methods");
const fs = require("fs");
const mime = require("mime");
const multer = require("multer");
const router = express.Router();

const upload = multer({
    dest: 'public/',
    /*storage: storage,
    limits: {
      fileSize: max_upload_size,
    },*/
});

router.post("/upload/image",utils.extractToken, upload.array("file", 1),(req, res) => {
    try{
        var file_path = ""
        req.files.forEach(async (file) => {
        const new_file_name = `${new Date().getTime()}.${mime.getExtension(file.mimetype)}`;
        fs.rename(
            file.path,
            `public/${new_file_name}`,
            function (err) {
              if (err) throw err;
            }
          );
          console.log(`public/${new_file_name}`);
          file_path = `public/${new_file_name}`
        });
      

        res.status(200).json({
            message:"Image Uploaded",
            data: file_path
        });
      }catch(err){
          console.log(err)
          res.status(400).send(err)
      }
});

module.exports = router;
