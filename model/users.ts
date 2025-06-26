import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },  
  password: { type: String },                                 // mật khẩu đã mã hóa
  phone: { type: String, required: true, unique: true },      // số điện thoại
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // phân quyền
  otp: { type: String },                                      // mã OTP đã hash
  otpExpires: { type: Date },                                 // thời gian hết hạn OTP
  otpVerified: { type: Boolean, default: false },             // đã xác minh OTP
  status: { type: Number, default: 1 }                        // 1: hoạt động, 0: bị khóa
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
