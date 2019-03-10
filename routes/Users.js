const Express = require('express')
const users = Express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const user = require('../model/Users')
users.use(cors())

process.env.SECRET_KEY = 'secret'

//REGISTER
users.post('/register',(req,res) => {
    const today = new Date()
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        mobile_number: req.body.mobile_number,
        address: req.body.address,
        created: today
    }

    user.findOne({
        where: {
            email: req.body.email
        }
    })

        .then(user => {
            if (!user){
                const hash = bcrypt.hashSync(userData.password,10)
                userData.password = hash
                user.create(userData)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, { 
                            expiresIn: 1440
                    })
                    res.json({token:token})
            }) 
            .catch(err =>{
                res.send('error: '+ err)
            })
        } else{
            res.json({error: "User already exist"})
        }
    })
    .catch(err => {
        res.send('error: '+ err)
    })

})

//LOGIN

users.post('/login',(req,res)=>{
    user.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (bcrypt.compareSync(req.body.password,user.password)){
                let token = jwt.sign(sign.dataValues, process.env.SECRET_KEY,{
                   expiresIn: 1440 
                })
                res.json({token: token})
            } else {
                res.send('User does not exist')
            }
        })
         .catch(err => {
             res.send('error:'+ err)
         })
})


//Profile

users.get('/profile', (req,res) =>{
    var decoded = jwt.verify(req.header['authorization'],process.env.SECRET_KEY)

    user.findOne({
        where: {
            id: decoded.id
        }
    })

    .then(user => {
        if (user) {
            res.json(user)
        } else{
            res.send('User does not exist')
        }
    })
    .catch(err => {
        res.send('error :'+ err)
    })
})
 
module.exports=users

