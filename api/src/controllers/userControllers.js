const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken, isAuth } = require("./utils");
// var findOrCreate = require('mongoose-findorcreate')

// async function signUp(req, res, next) {
//   const { name, email, password, isAdmin, susbscribed } = req.body;
//   console.log(password)
//   try {
//     const hashedPass = await bcrypt.hashSync(password, 8); // la pass que ingresa el usuario se guarda ya hasheada
//     console.log(hashedPass)
//     const [user, created] = await User.findOrCreate({
//       where: { email: email },
//       defaults: {
//         email:email,
//         name: name,
//         password: hashedPass,
//         isAdmin: isAdmin,
//         susbscribed, // al newsletter
//       },
//     });
//     if (created) { // es un booleano que retorna el findOrCreate
//       return res.status(200).send('Usuario creado con éxito.', { user: user });
//     } else {
//       return res.status(400).send('El usuario ya existe.', { user: user });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
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
              if(err) {
                  next(err);
                  return res.send({msg: 'Hubo algun error con los datos proporcionados'});
              }else
                  return res.send({
                      msg: 'Usuario creado con exito!',
                      data: {
                          _id: userCreated._id,
                          name: userCreated.name,
                          email: userCreated.email,
                          isAdmin: userCreated.isAdmin,
                          // token: generateToken(userCreated)
                      }});
          });
      }
  } catch (error) {
      next(error);
  } 
}


// async function signIn(req, res, next) {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email: email });
//     if (user) {
//       if (bcrypt.compareSync(password, user.password) === true) {
//         return res.status(200).json(user);
//       } else return res.status(400).send('Contraseña incorrecta.');
//     } else return res.status(400).send('Email incorrecto.');
//   } catch (error) {
//     next(error);
//   }
// };
async function signIn(req, res, next) {
  try {
      console.log(req.body);
      const {email,password} = req.body;
      const user = await User.findOne({email: email});
      console.log('user del logueo',user)
      if(user) {
          bcrypt.compareSync(password, user.password) ? 
              res.send({
                  
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  isAdmin: user.isAdmin,
                  // token: generateToken(user)
              }) : res.send({msg: 'Contraseña incorrecta.'})
      }else {
          return res.send({msg: 'Email incorrecto.'});
      }   
  } catch (error) {
      next(error);
  } 
};

async function getUserById(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    return res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

async function updateUserById(req, res, next) {
  const { id } = req.params;
  const { name, email, password, isAdmin, susbscribed } = req.body;
  try {
    const user = await User.findById(id);
    if (user) {
      await User.updateOne({_id: id}, { name, email, password, isAdmin, susbscribed });
      return res.status(200).send('Usuario actualizado correctamente.');
    } else {
      return res.status(400).send('Usuario no encontrado.');
    }
  } catch (error) {
    next(error);
  }
};

async function updateCart(req, res, next){
  const { id } = req.params
  const {cart} = req.body
  try{
    const user = await User.findByIdAndUpdate(id, {cart: cart})
    await user.save()
    return res.status(200).send("Carrito actualizado")
  }catch (error) {
    next(error)
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      await User.deleteOne({ _id: id });
      return res.status(200).send('Usuario eliminado.');
    } else {
      return res.status(400).send('Usuario no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

async function signInFirebase(req, res, next) {
    try {
        console.log(req.body);
        const {email} = req.body;
        const user = await User.findOne({email: email});
        console.log('aqui esta el user',user)
        if(user) {
            // bcrypt.compareSync(password, user.password) ? 
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    // token: generateToken(user)
                }) 
                // :
            // res.send({msg: 'Contraseña incorrecta.'})
        }else {
            return res.send({msg: 'Email incorrecto.'});
        }   
    } catch (error) {
        next(error);
    } 
};

module.exports = {
  signInFirebase,
  signUp,
  signIn,
  getUserById,
  updateUserById,
  updateCart,
  deleteUser,
  getUsers,
};