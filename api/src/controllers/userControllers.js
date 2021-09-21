const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken, isAuth, createResetRequest, getResetRequest, } = require("./utils");

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
              //return res.send({msg: 'El usuario ya existe.'})
              return res.status(202).send({type: 'error', message: `El usuario ya existe`}); 
            }
            return res.status(202).send({type: 'error', message: `Ya existe un usuario registrado con este email. Por favor elige otro`}); 
            //return res.send({msg: 'Ya existe un usuario registrado con este email. Por favor elige otro.'});
          } else {
            User.create({ name, email, password: bcrypt.hashSync(password, 8), country, phone, address, isAdmin }, function (err, userCreated) {
              if(err) {
                next(err);
                  return res.status(200).send({type: 'error', message: `Hubo algun error con los datos proporcionados`}); 
                  //return res.send({msg: 'Hubo algun error con los datos proporcionados'});
              }else
                  return res.status(200).send({
                    type: 'success',
                    message: 'Usuario creado con exito!',
                      data: {
                          _id: userCreated._id,
                          name: userCreated.name,
                          email: userCreated.email,
                          isAdmin: userCreated.isAdmin,
                          // token: generateToken(userCreated)
                      }
                  });
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
              res.status(200).send({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  isAdmin: user.isAdmin,
                  // token: generateToken(user)
              }) : res.status(202).send({type: 'error', message: `Contraseña incorrecta.`}); 
      }else {
        return res.status(202).send({type: 'error', message: `E-mail incorrecto.`}); 
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
      await User.updateOne({_id: id}, { name, email, password, isAdmin, susbscribed }); // no debería updatear la pass acá
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

//Cambiamos la logica del Delete User, para solo cambiar su estado Bloqued->true
async function deleteUser(req, res, next) {
  const { id } = req.params;
  const blocked = true;
  //console.log('id user:', id)
  try {
    const user = await User.findById(id);
    //const user = await User.findById(id);
    //console.log('usario', user)
     if (user) {
      await User.updateOne({_id: id}, { blocked });
      return res.status(202).send({type: 'success', message: `Usuario bloqueado`}); 
      //await User.deleteOne({ _id: id });
      //return res.status(200).send('Usuario eliminado.');
    } else {
      return res.status(202).send({type: 'error', message: `Usuario no enontrado`});
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
        const {name, email} = req.body;
        const password='';
        const country='';
        const phone='';
        const address='';
        const isAdmin=false;
        const typelogin='Google';

        const user = await User.findOne({email: email});
        console.log('aqui esta el user',user)
        if(!user){
          User.create({ name, email, password: bcrypt.hashSync(password, 8), country, phone, address, isAdmin, typelogin }, function (err, userCreated) {
            if(err) {
              next(err);
                return res.status(200).send({type: 'error', message: `Hubo algun error con los datos proporcionados`}); 
                //return res.send({msg: 'Hubo algun error con los datos proporcionados'});
            }else
                return res.status(200).send({
                  type: 'success',
                  message: 'Usuario creado con exito!',
                    data: {
                        _id: userCreated._id,
                        name: userCreated.name,
                        email: userCreated.email,
                        isAdmin: userCreated.isAdmin,
                        // token: generateToken(userCreated)
                    }
                });
          });
        }else{
          res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
        }
        /* if(user) {
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
        }   */ 
    } catch (error) {
        next(error);
    } 
};

async function passwordForgot(req, res, next) {
  const { email } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({email: email});
    if (user) {
      const id = uuidv1(); // se genera un id que se envia al usuario
      const request = { email: user.email, name: user.name, id }; // como puedo guardar la request en la do la store? pq la neesito para comparar el id
      createResetRequest(request);
      // passResetEmail(user.email, user.name, id); // ver si es así que se manda
      res.status(200).send('Solicitud de restablecimiento enviada.');
    }
  } catch (error) {
    next(error);
  }
};

async function passwordReset(req, res, next) {
  const { email } = getResetRequest(req.body.id);
  try {
    if (request) {
      // const user = await User.findOne({email: email});
      const password = bcrypt.hashSync(req.body.password, 8); // la pass nueva que viene por form
      await User.updateOne({ email: email }, { password });
      return res.status(200).send('Contraseña actualizada correctamente.');
    } else {
      return res.status(400).send('Usuario no encontrado.');
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
  passwordForgot,
  passwordReset,
};