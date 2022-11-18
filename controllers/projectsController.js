const projectModel = require('../models/projectModel.js')

//  Get All Projects
//  Method = Get
//  API = http://localhost:5000/api/projects
exports.getProjects = async (req,res,next)=>{
    try {
        const projects = await projectModel.find()
        

        return res.status(200).json({ 
            success:true,
            count:projects.length,
            data:projects
        })
    } catch (error) {
       res.status(500).json({ 
        success:false,
        error:"server error"
       });
    }
    
}




//  Add Projects
//  Method = Post
//  API = http://localhost:5000/api/projects
exports.addProject = async (req,res,next)=>{
    try {
        const {name,detail} = req.body
       const existing = await projectModel.findOne({name})
       if(existing){
        return res.status(400).json({message:"Project with this name already exist" })
       }

       const project = await projectModel.create({name,detail})
      

         return res.status(201).json({ 
        success:true,
        data :project
       })
    
       } catch (error) {
        if(error.name === 'validationError'){
            const messages = Object.values(error.errors).map(val => val.message)
    
            return res.status(400).josn({ 
                success:false,
                error:messages
            })
        }else{
            return res.status(500).json({
                success:false,
                error:error.message
            })
        }
        
       }
}

//  Update a Single Projects
//  Method = Put
//  API = http://localhost:5000/api/projects/ some id here with no spaces

exports.updateProject = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const updatedProject = req.body;
        const options = { new: true };

        const result = await projectModel.findByIdAndUpdate(
            id, updatedProject, options
        )

        res.status(200).json({ 
            success:true,
            data:result
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


//  Delete a Single Projects
//  Method = Delete
//  API = http://localhost:5000/api/projects/ some id here with no spaces


exports.deleteProject = async (req,res,next)=>{
    try {
        const project = await projectModel.findById(req.params.id)

        if(!project){
            return res.status(404).json({ 
                success:false,
                error:"No Transaction Found"
            })
        }
        await project.remove()

        return res.status(200).json({ 
            success:true,
            data:{},
            message:"Record Successfully Deleted"

        })

    } catch (error) {
     res.status(500).json({ 
        success:false,
        error:"server error"
       });   
    }
    
}