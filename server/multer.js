const multer = require('multer');
const path = require('path');

const resolve = (dir) => {
    return path.join(__dirname, './', dir)
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, resolve('/images'))
        } else {
            cb({ error: 'Mime type not supported' })
        }
    },
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, new Date().getTime() + "." + fileFormat[fileFormat.length - 1]);
    },
    encoding: 'utf-8'
})

const multerConfig = multer({
    storage: storage,
})

function uploadConfig(req, res) {
    return new Promise((resolve, reject) => {
        multerConfig.single("image")(req, res, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve('http://localhost:8999/images/' + req.file.filename)
            }
        });
    })
}

module.exports = uploadConfig;
