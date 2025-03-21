import { Schema, model } from "mongoose";

const userSchema = Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    surname:{
        type: String,
        required: [true, "Surname is required"],
        maxLength: [25, "Surname cannot exceed 25 characters"]
    },
    username:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    phone:{
        type: String,
        minLength: [8, "Phone must be at least 8 characters"],
        maxLength: [11, "Phone cannot exceed 11 characters"],
        required: [true, "Phone is required"]
    },
    role:{
        type: String,
        required: [true, "Role is required"],
        enum: ["ADMIN_ROLE", "CLIENT_ROLE"],
        default: 'CLIENT_ROLE'
    },
    status:{
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timestamps: true
})

userSchema.methods.toJSON = function(){
    const {password, _id, ...usuario} = this.toObject()
    usuario.uid = _id
    return usuario
}

export default model("User", userSchema)
