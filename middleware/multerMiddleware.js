const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, './imgUploads')
    },
    filename:(req, file, callback)=>{
        callback(null, `image - ${file.originalname}`)
    }
})

const fileFilter =(req, file, callback)=>{
    if(file.mimetype=='image/png' || file.mimetype=='image/jpg' || file.mimetype=='image/jpeg'){
        callback(null, true)
    }else{
        callback(null, false)
        callback(new Error('png, jpg, jpeg files only allowed'))
    }
}


const multerconfig = multer({
    storage,
    fileFilter
})

module.exports = multerconfig