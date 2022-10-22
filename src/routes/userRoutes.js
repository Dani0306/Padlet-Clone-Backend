import { Router } from 'express'
import Padlet from '../models/Padlet.js';
import User from '../models/User.js'
import { createJwt } from '../utilities/jwtCreation.js';

const userRouter = Router();

// REGISTER 

userRouter.post('/register', async (req, res) => {
    const { username, email, profile } = req.body;

    const user = await User.findOne({ email });
    
    if(user) return res.status(404).json({ message: 'This email address is already related to other account, try to sign in please.' })

    const newUser = await new User({
        username, email, profile
    }).save()

    const token = createJwt(newUser);

    return res.status(200).json({
        user: newUser, token
    })

})

// LOGIN 

userRouter.post('/login', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email })
    if(!user) return res.status(404).json({ message: 'This email address is not related to any account, try sign up please.' })

    const token = createJwt(user);

    return res.status(200).json({
        user, token
    })

})

// getUSer

userRouter.get("/user/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        return res.status(200).json({ user })
    } catch (e){
        console.log(e)
    }

})

// get user padlets

userRouter.get("/padlets/:email", async (req, res) => {
    const { email } = req.params;

    const user = await User.findOne({ email });
    let padlets = [];
    
    for (let i = 0; i < user.padlets.length; i++){
        const padlet = await Padlet.findOne({ code: user.padlets[i] });
        padlets.push(padlet);
    }

    return res.status(200).json({ padlets })

})

// filter users


userRouter.get("/getUsers/:index/:code", async (req, res) => {
    const { index, code } = req.params;

    const users = await User.find();
    const padlet = await Padlet.findOne({ code });
    let usersToReturn = [];
    
    for (let i = 0; i < users.length; i++){
        if(users[i].email.indexOf(index) > -1 && !padlet.members.includes(users[i].email)) usersToReturn.push(users[i].email);
    }

    return res.status(200).json(usersToReturn)
})


export default userRouter;