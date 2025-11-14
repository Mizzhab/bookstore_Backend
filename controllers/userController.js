const users = require('../model/userModel');
const jwt = require ('jsonwebtoken')

//register
exports.registerController = async(req, res)=>{
    //logic
    const {username, password, email} = req.body
    console.log(username, password, email);
    
    try {

        const existingUser = await users.findOne({email})

        if(existingUser){
            res.status(406).json('user already exist')
        }else{
            const newUser = new users({
                username,
                email,
                password,
            })
            await newUser.save()
            res.status(200).json(newUser)
        }

    } catch (error){
        res.status(500).json(error)
    }
}

//login
exports.loginController = async(req, res)=>{
    const {email, password} = req.body
    console.log(email, password);
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            if(existingUser.password == password){
                const token = jwt.sign({userMail:existingUser.email},process.env.JWTSECRETKEY)
                res.status(200).json({existingUser, token})
            }else{
                res.status(403).json('Invalid credentials')
            }
        }else{
            res.status(406).json('user Doesnot exist. Please register')
        }
    }catch (error){
        res.status(500).json(error)
    }
}

exports.updateProfileController = async(req, res)=>{
    const userMail = req.payload

    const {username, password, bio, profile} = req.body

    pro = req.file?req.file.filename:profile
    console.log(pro);

    try {
        const updatedProfile = await users.findOneAndUpdate({email:userMail},{
            username,
            email:userMail,
            password,
            bio,
            profile: pro
        },{ new: true })
        res.status(200).json(updatedProfile)

    } catch (error) {
        res.status(500).json(error)
    }

}

exports.googleLoginController = async (req, res)=>{
    const {username, email, password, photo} = req.body
    console.log(username, email, password, photo);
    try {
        const existingUser = await users.findOne({email})
        if(existingUser){
             const token = jwt.sign({userMail:existingUser.email},process.env.JWTSECRETKEY)
                res.status(200).json({existingUser, token})
        }else{
             const newUser = new users({
                username,
                email,
                password,
            })
            await newUser.save()
             const token = jwt.sign({userMail:email},process.env.JWTSECRETKEY)
            res.status(200).json({existingUser: newUser, token})
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
}

//----------------------ADMIN--------------------

exports.getAllUserController =async(req,res)=>{
    const query = {
        email:{
            $ne:'AdminBookstore@gmail.com'
        }
    }
    try{
        const allUsers = await users.find(query)
        res.status(200).json(allUsers)
    }catch(error){
        res.status(500).json(error)
    }
}