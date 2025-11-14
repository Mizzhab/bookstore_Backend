const applications = require("../model/applicationModel");


exports.addApplicationController = async(req,res)=>{
    const {jobtitle, joblocation, fullname, qualification, email, phone, coverletter} = req.body
    const resume = req.file.filename
    console.log(jobtitle, joblocation,fullname, qualification, email, phone, coverletter, resume);

    try {
        const existingApplication = await applications.findOne({jobtitle, joblocation, email})

        if(existingApplication){
            res.status(401).json('Already Applied for this Job')
        }else{
            const newApplication = new applications({
                jobtitle, joblocation, fullname, qualification, email, phone, coverletter, resume
            })
            await newApplication.save()
            res.status(200).json(newApplication)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAllApplicationController = async(req, res)=>{
    try {
        const allApplications = await applications.find()
        res.status(200).json(allApplications)
    } catch (error) {
        res.status(500).json(error)
    }
}