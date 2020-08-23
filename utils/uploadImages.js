const multer=require('multer');
const AppError = require('./appError');
const storage= multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'./uploads/')
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
        return new AppError('type not okkay');
      cb(null, false);
    }
  };
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });
module.exports=upload