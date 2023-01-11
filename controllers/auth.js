const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { generateJWT } = require('../helpers/jwt');
const User = require('../models/User');

const createUser = async(req = request, res = response) =>
{
    const { email, password } = req.body;
    
    try 
    {
        let user = await User.findOne({ email });
        
        if(user)
        {
            return res.status(400).json({
                ok: false,
                msg: 'Email already used'
            });
        }
        
        user = new User(req.body);
    
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        const token = await generateJWT(user.id, user.name);
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } 
    catch (error) 
    {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Internal Server Error'
        });
    }
}

const loginUser = async(req = request, res = response) =>
{
    const { email, password } = req.body;

    try 
    {
        let user = await User.findOne({ email });
        
        if(!user)
        {
            return res.status(400).json({
                ok: false,
                msg: 'Wrong email or password'
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword)
        {
            return res.status(400).json({
                ok: false,
                msg: 'Wrong email or password'
            });
        }

        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } 
    catch (error)
    {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Internal Server Error'
        });
    }
}

const renewToken = async(req = request, res = response) =>
{
    const { uid, name } = req;

    const token = await generateJWT(uid, name);
    
    res.json({
        ok: true,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    renewToken
};