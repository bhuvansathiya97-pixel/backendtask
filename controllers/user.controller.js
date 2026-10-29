const UserService=require('../services/user.services')
class UserController{
    async signup(req,res){
        try{
        const {name,email,password}=req.body
        if(!name || !email||!password){
                return res.status(400).json({message:"All fields are required!"})
            }
            const result=await UserService.signup(name,email,password)
            return res.status(201).json({message:"User created successfully",data:result});
        }catch(err){           
            return res.status(500).json({message:err.message})
        }

    }
    async update(req, res) {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const result = await UserService.update(id, password);

        return res.status(200).json({
            message: "User updated successfully",
            data: result
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
}
    async getAllUsers(req,res){
        try {
            const result=await UserService.getAllUsers()
            return res.status(201).json({message:"User fetched successfully",data:result});

        } catch (err) {
            return res.status(500).json({message:err.message})
            
        }
    }
    async softDeleteUser(req,res){
        try{
            const{id}=req.params
            const result =await UserService.softDeleteUser(id)
            return res.status(201).json({message:"User deleted successfully",data:result});

        }
    catch(err){
            return res.status(500).json({message:err.message})

    }
    }   
    async login(req,res){
        try {
            const{email,password}=req.body
            if(!email||!password){
                return res.status(400).json({message:'Both "email" and "password" are required'})
            }
            const loginData=await UserService.loginUser(email,password)
            return res.status(200).json(loginData)
        } catch (error) {
            res.status(401).json({error:error.message})
        }
    }
    async adduserProfile(req,res){
        try {
            const userId=req.user.id
            const{age,dob,bio}=req.body
            if(!userId){
                return res.status(400).json({message:'User Id is required'})
            }
            const newuserProfile=await UserService.adduserProfile(userId,{age,dob,bio})
            res.status(201).json(newuserProfile)
        } catch (error) {
            if(error.code===11000){
                return res.status(409).json({message:"A profile for this user already exists"})
            }
            console.log(error)
            res.status(400).json({error:error.message})
        }
    }
    }
    module.exports= new UserController();