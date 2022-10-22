import mongoose from 'mongoose'


const padletSchema = new mongoose.Schema({
    code: String,
    privacy: String,
    name: String,
    members: [String],
    owner: {
        username: String, 
        email: String, 
        profile: String
    },
    padlets: [{
        title: String, 
        id: String,
        content: String,
        image: String, 
        owner: {
            username: String, 
            email: String, 
            profile: String
        },
    }],
})

const Padlet = mongoose.model('Padlet', padletSchema);


export default Padlet