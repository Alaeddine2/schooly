module.exports = {
    extractToken: function (req, res, next) {
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array & get the token
            req.token = bearer[1];
            // Next middleware
            next();
        } else {
            // Forbidden
            res.sendStatus(403);
        }
    }
};

/*module.exports = {
    uploadProfilePicture: function (req, res) {
        try{
            const user_id =req.user._id;
            req.files.forEach(async (file) => {
            const new_file_name = `${new Date().getTime()}.${mime.getExtension(file.mimetype)}`;
            await User.updateOne({ _id: user_id }, { user_image: new_file_name });
            fs.rename(
                file.path,
                `public/${new_file_name}`,
                function (err) {
                  if (err) throw err;
                }
              );
            });
            const updated_user = await User.findOneAndUpdate({_id:user_id},{$set:req.body},{new:true});
            res.json({
                success:true,
                message:"API.USER_IMAGE_UPLOADED",
                data:updated_user
            });
          }catch(err){
              console.log(err)
              res.send(err)
          }
    }
};*/