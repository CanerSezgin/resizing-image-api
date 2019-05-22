const express = require('express')
const resize = require('./resize')
const upload = require('./multerInit')
const sizeOf = require('image-size');
const multer  = require('multer')
const fs = require('fs')
var app = express()
const port = process.env.PORT || 4000;

 
app.post('/resize', (req, res, next) => {
    upload(req, res, (err) => {
        /* Error Handling */
        if (err instanceof multer.MulterError) {
            return res.status(400).json({error: err})
          } else if (err) {
            return res.status(400).json({error: err})
          }
        if (!req.file){
            return res.status(404).json({error: 'Missing File'})
        }

    /* Params */
    let {height, width, scaleup, keepaspectration} = req.body;
    const image = req.file.path;

    /* Original Image Info */
    var originalImage = sizeOf(image);
    const ext = req.file.mimetype.split('/')[1]
    originalImage.aspectRatio = originalImage.width / originalImage.height;

    /* DELETE */
    /* 
        If you are gonna provide only BOOLEAN you don't need these...
        I just add to provide string ("true", "false") params for test purpose
    */
    scaleup = (scaleup === 'false') ? false : scaleup
    scaleup = (scaleup === 'true') ? true : scaleup
    keepaspectration = (keepaspectration === 'false') ? false : keepaspectration
    keepaspectration = (keepaspectration === 'true') ? true : keepaspectration

    /* DEFAULT VALUES */
    /* Width, Height is optional. If user doesn't send any width/height, original W/H will be valid */
    width = width ? width : originalImage.width
    height = height ? height : originalImage.height
    scaleup = (typeof scaleup === 'boolean')  ? scaleup : false
    keepaspectration = (typeof keepaspectration === 'boolean') ? keepaspectration : true

    /* If it can not be scaleup, MAX_DIMs should be originalImageDIMs */
    if(!scaleup){
        width = (width > originalImage.width) ? originalImage.width : width
        height = (height > originalImage.height) ? originalImage.height : height
    }

    /* According to Aspect Ratio, resize max dimensions */
    if(keepaspectration){
        let askedAspectRatio = width / height
        if(askedAspectRatio > originalImage.aspectRatio){
            width = height * originalImage.aspectRatio
        } else {
            height = width / originalImage.aspectRatio
        }
    }

    /* Resize Image */
    var w = parseInt(width);
    var h = parseInt(height);
    
    res.type(`image/${ext}`)
    resize(image, w, h).pipe(res)

    // Delete Temporary Image
    fs.unlink(image);
})
})
  
app.listen(port, () => {
  console.log('Live on', port)
});