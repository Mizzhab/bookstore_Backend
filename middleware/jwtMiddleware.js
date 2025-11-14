const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next)=>{
    console.log('inside jwt middleware');
    const token = req.headers["authorization"].split(' ')[1]
    try{
        const jwtResponse = jwt.verify(token,process.env.JWTSECRETKEY)
        req.payload = jwtResponse.userMail
        next()
        
    }catch(error){
        res.status(401).json('Authorization Failed')
    }
}
module.exports = jwtMiddleware
