import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    username: String,
    profile: String, 
    email: String,
    padlets: [String]
}, {
    versionKey: false
})


const User = mongoose.model('User', userSchema);

export default User;