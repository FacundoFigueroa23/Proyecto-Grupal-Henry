const User = require('../models/User');
const bcrypt = require('bcrypt');

async function signUp(req, res ,next) {
    try {
        console.log(req.body);
        const {name, email, password, country, phone, address, isAdmin } = req.body;
        const user = await User.findOne({email: email});
        if(user){
            if(bcrypt.compareSync(password, user.password)){
                return res.send({msg: 'El usuario ya existe.'})
            }
            return res.send({msg: 'Ya existe un usuario registrado con este email. Por favor elige otro.'});
        } else {
            User.create({ name, email, password: bcrypt.hashSync(password, 8), country, phone, address, isAdmin }, function (err, userCreated) {
                err && next(err);
                if(userCreated) return res.send({msg: 'Usuario creado con exito!', data: userCreated});
                else return res.send({msg: 'Hubo algun error con los datos proporcionados'});
            });
        }
    } catch (error) {
        next(error);
    } 
}

async function signIn(req, res, next) {
    try {
        console.log(req.body);
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        user ?
        (
            bcrypt.compareSync(password, user.password) ? 
                res.send({
                    _id: user._id,
                    name: user.name,
                    email:user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user)
                }) :
            res.send({msg: 'Contraseña incorrecta.'})
        ) :
        res.send({msg: 'Email incorrecto.'});
    } catch (error) {
        next(error);
    } 
};

module.exports = {
    signUp,
    signIn
}