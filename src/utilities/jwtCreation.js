import jwt from 'jsonwebtoken'
import { SECRET } from './config.js';

export const createJwt = (user) => {
    const { email, username, profile } = user;
    const token = jwt.sign({
        email, 
        username,
        profile
    }, SECRET, {
        expiresIn: '24h'
    })

    return token;

}