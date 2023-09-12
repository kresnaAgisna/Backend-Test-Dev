const express = require('express')
const app = express()
const port = 3000
const { signToken, verifyToken } = require('./helpers/jwt')
const { comparePassword } = require('./helpers/bcrypt')
const { Contact, User } = require('./models/index')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.post('/register', async(req, res, next) => {
    const { email, password } = req.body
    try {
       const newUser = await User.create({email, password})

        res.status(201).json({id: newUser.id, email})
    } catch (error) {
        next(error)
    }
})

app.post('/login', async(req, res, next) => {
    const { email, password } = req.body
    try {
        if(!email || !password) {
            throw({name: 'InvalidEmailPassword', message: 'Invalid Email/Password'})
        }
        const user = await User.findOne({where: {email}})

        if(!user || !comparePassword(password, user.password)) {
            throw({name: 'InvalidEmailPassword', message: 'Invalid Email/Password'})
        }
        const access_token = signToken({id: user.id})

        res.status(200).json({access_token})
    } catch (error) {
        next(error)
    }
})

app.use(async(req, res, next) => {
    const { access_token } = req.headers 
    try {
        if(!access_token) {
            throw({name: 'InvalidToken', message: 'Invalid Token'})
        }

        const payload = verifyToken(access_token)

        const user = await User.findOne({where: {id: payload.id}})
        
        if(!user) {
            throw({name: 'InvalidToken', message: 'Invalid Token'})
        }

        req.user = payload

        next()
    } catch (error) {
        next(error)
    }
})

app.get('/contact', async(req, res, next) => {
    try {
        const contacts = await Contact.findAll()

        res.status(200).json(contacts)
    } catch (error) {
        next(error)
    }
})

app.post('/contact', async(req, res, next) => {
    const {nama, email, phoneNumber} = req.body
    const UserId = req.user.id
    try {
        const newContact = await Contact.create({nama, email, phoneNumber, UserId})

        res.status(201).json(newContact)
    } catch (error) {
        next(error)
    }
})

app.put('/contact/:id', async(req, res, next) => {
    const {nama, email, phoneNumber} = req.body
    const contactId = req.params.id
    try {
        const contact = await Contact.findOne({where: {id: contactId}})
        if(!contact) {
            throw({name: 'ContactNotFound', message: 'Invalid contact id'})
        }

        if(+contact.UserId !== +req.user.id) {
            throw({name: 'Unauthorized', message: 'Unauthorized'})
        }

        await contact.update({nama, email, phoneNumber})

        res.status(200).json({message: 'updated'})
    } catch (error) {
        next(error)
    }
})

app.delete('/contact/:id', async(req, res, next) => {
    const contactId = req.params.id
    try {
        const contact = await Contact.findOne({where: {id: contactId}})
        if(!contact) {
            throw({name: 'ContactNotFound', message: 'Invalid contact id'})
        }

        if(+contact.UserId !== +req.user.id) {
            throw({name: 'Unauthorized', message: 'Unauthorized'})
        }

        await contact.destroy()

        res.status(200).json({message: 'contact deleted'})
    } catch (error) {
        next(error)
    }
})

app.use((error, req, res, next) => {
    let status = 500
    let message = 'Internal Server Error'
    let name = error.name
    switch(name) {
        case 'SequelizeUniqueConstraintError':
        case 'SequelizeValidationError':
            status = 400;
            message = error.errors[0].message;
            break;
        case 'InvalidEmailPassword':
            status = 400;
            message = error.message
        case 'InvalidToken':
            status = 401;
            message = error.message
        case 'JsonWebTokenError':
            status = 401;
            message = 'Invalid Token'
        case 'ContactNotFound':
            status = 404;
            message = error.message
        case 'Unauthorized':
            status = 403;
            message = error.message
    }

    res.status(status).json({message})
})

app.listen(port, () => {
    console.log(`app run in ${port}`)
})