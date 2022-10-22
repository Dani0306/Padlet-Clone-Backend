import { Router } from 'express'
import Padlet from '../models/Padlet.js';
import User from '../models/User.js';
import { v4 } from 'uuid'


const padletRouter = Router();

// getting all the padlets per room

padletRouter.get("/padlets/:code", async (req, res) => {
    const { code } = req.params;

    const padlet = await Padlet.findOne({ code });

    return res.status(200).json({ padlet });

})

// create a padlet

padletRouter.post("/createRoom", async (req, res) => {
    const { code, privacy, name, owner } = req.body;

    const newPadlet = new Padlet({
        code, privacy, name, owner
    })

    await User.findOneAndUpdate({ email: owner.email }, { $addToSet: { padlets: code } })
    newPadlet.members.push(owner.email);
    await newPadlet.save();

    return res.status(200).json({ padlet: newPadlet })

})

// join to a padlet 
padletRouter.post("/join", async (req, res) => {
    const { email, code } = req.body;

    const padlet = await Padlet.findOne({ code });

    if(padlet.privacy === "private"){
        if(!padlet.members.includes(email)) return res.status(403).json({ message: "You are not allowed to enter to this private padlet." })
    }

    const updated = await Padlet.findOneAndUpdate({ code }, { $addToSet: { members: email } });
    await User.findOneAndUpdate({ email }, { $addToSet: { padlets: code } })

    return res.status(200).json({ padlet: updated })
})

// create a padlet modal


padletRouter.post("/createModal", async (req, res) => {
    const { code, title, content, image, owner } = req.body;

    const updated = await Padlet.findOneAndUpdate({ code }, { $addToSet: { padlets: { title, content, image, owner, id: v4() }}})

    return res.status(200).json({ padlet: updated })

})

// add members


padletRouter.post("/addMembers", async (req, res) => {
    const { code, members } = req.body;

    const padlet = await Padlet.findOne({ code });

    padlet.members = padlet.members.concat(members);
    await padlet.save();
    return res.status(200).json({ padlet })

})



padletRouter.post("/remove", async (req, res) => {
    const { code, id } = req.body;

    const padlet = await Padlet.findOne({ code });

    padlet.padlets = padlet.padlets.filter(x => x.id !== id);

    await padlet.save();

    return res.status(200).json(padlet);

})


export default padletRouter