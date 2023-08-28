export const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  confirmpassword: String,
  profile: String,
});


