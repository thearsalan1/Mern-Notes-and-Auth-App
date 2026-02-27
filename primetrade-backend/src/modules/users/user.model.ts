import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types/types";
import bcrypt from "bcryptjs";

const UserSchema:Schema = new Schema<IUser>(
  {
    email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
    },
    password:{
      type:String,
      required:true,
    },
    role:{
      type:String,
      enum:['user','admin'],
      default:'user',
    }
  },{
    timestamps:true,
  }
)

UserSchema.pre<IUser>('save',async function(){
  if(!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password= await bcrypt.hash(this.password,salt);
})

UserSchema.methods.comparePassword =async function(candidate: string): Promise<boolean> {
  return await bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);