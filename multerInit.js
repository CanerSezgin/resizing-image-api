const multer  = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname)
    },
})

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|tiff|webp|heif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname){
        return cb(null, true)
    } else {
        cb({
            message: 'File Type is not supported',
            supportedFileTypes: 'JPG, JPEG, PNG, TIFF, GIF, WebP, HEIF'
        }, false)
    }
}

var upload = multer({ 
    storage, 
    limits: {
        /* MAX File Size: 100 MB */
        fileSize: 1024 * 1024 * 100
    },
    fileFilter,
}).single('image')

module.exports = upload