
const multer  = require('multer')
const path= require("path")
// const { nanoid } = require("nanoid")




const fs= require("fs")

const fileValidation={
    image:['image/jpeg','image/png'],
    pdf:['application/pdf']
}
const HandleMulterError =(err,req,res,next)=>{ /// this function to handle multer (limits size) not to fail server but return message that file too large
    if(err){
        res.status(400).json({message:"multer error",err})
    }else{
        next();
    }

}
function myMulter(customPath,customValidation){
   try {
    if(!customPath){
        customPath='general'
    }
     const fullPath= path.join(__dirname,`../uploads/${customPath}`);
     if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath,{recursive:true})
     } else {
        
     }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {// where do you store
            req.finalDestination= `uploads/${customPath}` /// why...
          cb(null/*there is no error*/,fullPath )
        },
        filename: function (req, file, cb) { // what is the fileName
          
          cb(null, nanoid()+'_'+file.originalname)
        }
      })
       
     const fileFilter= function (req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
        cb(null,true)
    } else {
        req.fileErr = true;
        cb(null,false)
    }
      
      }



      const upload= multer({dest:fullPath,limits:{fieldSize:625000},fileFilter,storage})
      return upload;
   } catch (error) { /// can't to appear error 
      res.json({message:"catch error",error})
   }
}

module.exports={
    myMulter,
    fileValidation,
    HandleMulterError
}