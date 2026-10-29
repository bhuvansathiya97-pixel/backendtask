const jwt =require('jsonwebtoken')
const JWT_SECRET=process.env.JWT_SECRET
class TokenService{
    generateToken(payload){
        return jwt.sign(payload,JWT_SECRET,{expiresIn:"1h"})
    }
}
module.exports=new TokenService();