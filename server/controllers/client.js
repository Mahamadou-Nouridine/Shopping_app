const clientModel = require('../models/client')
const bcrypt = require('bcrypt')

const createClient = async (req, res)=>{
    const {password, email, name}= req.body
    if(!password||!email||!name) return res.status(400).json({
        message:'All field are required'
    })

    //check duplicate 
    const dup =await clientModel.findOne({name:name})
    if(dup) return res.status(409).json({
        message: 'client already exist'
    })
    const dup1 =await clientModel.findOne({email})
    if(dup1) return res.status(409).json({
        message: 'client already exist'
    })

    //hash the password
    const hashedPwd = await bcrypt.hash(password, 10)

    //create and save the user
    const client = {
        name,
        password: hashedPwd,
        email
    }

    const newClient = await   clientModel.create(client)
    if(!newClient) return res.status(400).json({
        message: 'server Error'
    })

    return res.status(200).json({
        message: 'success, user created'
    })
}


module.exports = createClient