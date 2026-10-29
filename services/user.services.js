const User=require('../models/user.model')
const UserProfile=require('../models/user.profile.model')
const tokenService=require('../jwt/token.service')
const bcrypt=require('bcrypt');
const  mongoose  = require('mongoose');
class UserService{
    async signup(name,email,password){
            const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        const hashedPassword=await bcrypt.hash(password,10)
            const user=await User.create({name,email,password:hashedPassword})
            return user;
    }
    async getAllUsers(){
        const user=await User.find({isActive:true})
        // .populate('profile')
        const userIds=user.map((user)=>user._id)
        const userProfiles=await UserProfile.find({
            user:{$in:userIds},
        })

        const userWithprofiles=user.map((user)=>{
            const profile=userProfiles.find(
                (profile)=>profile.user.toString()===user._id.toString()
            )
            return{
                ...user.toObject(),
                profile:profile||null,
            }
        })
        return userWithprofiles
    }
    async softDeleteUser(id){
        const user=await User.findById(id)
        if(!user){
            throw new Error("User not found")
        }
        user.isActive=false
        await user.save()
        return user
    }
    async loginUser(email,password){
        const user=await User.findOne({email}).select("+password")
        if(!user){
            throw new Error("User not Found")
        }
        if(!user.isActive){
            throw new Error("User is not active!")
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            throw new Error("Invalid credentials")
        }
        const payload={
            id:user._id,
            email:user.email,
            isActive:user.isActive,
        }
        const token=tokenService.generateToken(payload)
        const userWithoutPassword=user.toObject()
        delete userWithoutPassword.password
        return{user:userWithoutPassword,token}
    }
    async update(id, password) {
    const user = await User.findById(id);

    if (!user) {
        throw new Error("User not Found");
    }
    const hashedPassword=await bcrypt.hash(password,10)

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { password:hashedPassword },
        { new: true, runValidators: true }
    );

    return updatedUser;
}
    async adduserProfile(userId,profileData){
        if(!mongoose.isValidObjectId(userId)){
            throw new Error("Invalid user ID")
        }
        const user=await User.findById(userId)
        if(!user){
            throw new Error("User not found")
        }
        const userProfile=await UserProfile.create({
            user:userId,
            age:profileData.age,
            dob:profileData.dob,
            bio:profileData.bio,
        })
        user.profile=userProfile._id
        await user.save()
        return userProfile
    }
}
module.exports=new UserService();