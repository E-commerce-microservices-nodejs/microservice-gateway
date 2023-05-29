import mongoose, { Document, Schema } from "mongoose";

interface UserFields {
  email: string;
  password: string;
  credit:number,
  role:string,
  token:string
}

interface UserDocument extends Document, UserFields {}

const userSchema = new Schema<UserDocument>(
    {
        email: {
          type: String,
        required: true
          },
        password: {
              type: String,
                required: true    
              
          },
        token: {
                type: String,
                required: false
        },
        role:{
          type:String,
          required:true

        },
        credit:{
          type:Number,
          required:true
        }
        

    }

);

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
