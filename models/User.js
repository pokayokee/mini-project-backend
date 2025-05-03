import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

// Create MongoDB document schema
const UserSchema = new Schema({
  fullName: { type: String, require: true },
  email: { type: String },
  password: { type: String, required: true },
  createdOn: { type:Date, default: new Date().getTime() },
});

// Hash password before saving
UserSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Use schema to create model
// Mongoose will use model name User and name our collection as users automatically
export const User = model("User", UserSchema);