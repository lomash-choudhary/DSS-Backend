import mongoose, {Schema}from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    username:{
        type: String,
        required:[true, 'Username is required'],
        unique:true
    },
    password:{
        type:String,
        requried:[true, 'Password is required']
    },
    email:{
        type: String,
        requried:[true, 'Email is required'],
        unique:true
    },
    refreshToken:{
        type: String
    }
},{timestamps:true})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.USER_AUTH_TOKEN,
        {
            expiresIn: process.env.EXPIRY_ACCESS_TOKEN
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id
    },
    process.env.USER_AUTH_TOKEN,
    {
        expiresIn:process.env.EXPIRY_REFRESH_TOKEN
    }
    )
}

export const User = mongoose.model("User", userSchema)