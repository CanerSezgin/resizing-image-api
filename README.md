# Install node modules
```
npm install
```

# Start Server
```
npm run start
```

# Endpoint
```
http://localhost:4000/resize (POST)
```

# POST Request
### Headers
```
Content-Type: multipart/form-data
```
### Form Data
* height (optional, if there is no height, original image height is valid)
* width (optional, if there is no width, original image width is valid)
* scaleup (optional, default=false)
* keepaspectration (optional, default=true)
* Image (required)

# Flow
* Get params & original Image
* Save Image on the server (with Error handling)
* Resize Image accourding to params (with Error handling)
* Delete temporary image
* Return new image

# Responses
* 200: image file
* 400: Bad Request, unsupported extensions, too large file size
* 404: Missing file