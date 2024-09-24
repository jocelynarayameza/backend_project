import multer from 'multer';
import { __dirname } from '../utils.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/public/uploads')
    },
    filename: function (req, file, cb) {
    // CREA UN NOMBRE RANDOM
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)

    //ESTE UTILIZA EL NOMBRE ORIGINAL
    cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ storage: storage })
