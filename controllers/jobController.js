const jobs = require("../model/jobModel");

//add jobs
exports.addJobController = async(req, res)=>{
    const {title, location, jtype, salary,qualification,experience,description} = req.body
    console.log(title, location, jtype, salary,qualification,experience,description);
    
    try{
        const existingJob = await jobs.findOne({title,location})
        if(existingJob){
            res.status(401).json('Job already Added')
        }else{
            const newJob = new jobs({
                title, location, jtype, salary,qualification,experience,description
            })
            await newJob.save()
            res.status(200).json(newJob)
        }
    }catch(error){
        res.status(500).json(error)
    }
}

//get all jobs
exports.getAllJobsController = async(req, res)=>{
    const {search} = req.query
    try {
        const allJobs = await jobs.find({title:{$regex: search, $options: "i"}})
        res.status(200).json(allJobs)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteJobController = async(req, res)=>{
    const {id} = req.params
    try {
        const deleteJob = await jobs.findByIdAndDelete(id)
        res.status(200).json('deleted')
    } catch (error) {
        res.status(500).json(error)
    }
}