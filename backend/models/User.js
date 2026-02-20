import { model, Schema } from "mongoose"

const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: String,
  verifiedToken: String,
  verifiedTokenExpiresAt: String
}, { timestamps: true })

const User = model("User", UserSchema);

export default User;