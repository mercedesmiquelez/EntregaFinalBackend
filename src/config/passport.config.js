import passport from "passport";
import local from "passport-local";
import google from "passport-google-oauth20";
import jwt from "passport-jwt";
import envs from "./env.config.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import userRepository from "../persistences/mongo/repositories/user.repository.js";
import cartsRepository from "../persistences/mongo/repositories/carts.repository.js";

const LocalStrategy = local.Strategy; //Va a utilizar la estrategia de local
const GoogleStrategy = google.Strategy; // utilizamos la estrategia de google
const JWTStrategy = jwt.Strategy; //configuramos la estretegia
const ExtractJWT = jwt.ExtractJwt; //esto es un extractor de informacion

const cookieExtracto = (req) => {
  let token = null; //le digo que se inicialice en null

  if (req && req.cookies) {  //verificamos que haya una request y que verifique si en la request hay una cookie
    token = req.cookies.token; //si se cumplen estas dos condiciones le vamos a asignar el token
  }

  return token;
};

const initializePassport = () => {
  // Esta función inicializa las estrategias que configuremos
  // Para passport solo existen estas dos propiedades que puede recibir username y password
  passport.use(
    "register",
    new LocalStrategy(
    /* 
    "register" es el nombre de la estrategia que estamos creando.
    passReqToCallback: true, nos permite acceder a la request en la función de autenticación.
    usernameField: "email", nos permite definir el campo que usaremos como username de passport.
    done es una función que debemos llamar cuando terminamos de procesar la autenticación.
    Nota: passport recibe dos datos el username y el password, en caso de que no tengamos un campo username en nuestro formulario, podemos usar usernameField para definir el campo que usaremos como username.
    */
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age, role } = req.body; // tomamos la data del user desde el body

          const user = await userRepository.getByEmail(username); // buscamos por email el usuario
          if (user) return done(null, false, { message: "The user already exists" });

          const cart = await cartsRepository.create();

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role,
            cart: cart._id
          };

          const createUser = await userRepository.create(newUser);
          return done(null, createUser);
        } catch (error) {
          return done(error); //si habia un problema, le vamos a pasar el error de la autenticacion en done
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userRepository.getByEmail(username);
        if (!user || !isValidPassword(user, password)) return done(null, false, { message: "Invalid email or password" });

        // Si están bien los datos del usuario
        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: envs.GOOGLE_CLIENT_ID,
        clientSecret: envs.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/google",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const { name, emails } = profile;

          const user = {
            first_name: name.givenName,
            last_name: name.familyName,
            email: emails[0].value,
          };

          const existUser = await userDao.getByEmail(emails[0].value); //Chequeo si el usuario existe registrado
          if (existUser) return cb(null, existUser); //si existe: null porque no hay ningun error, y el usuario para acceder a su sesion

          const newUser = await userDao.create(user);  //si no se cumple lo anterior, se crea un nuevo usuario
          cb(null, newUser);
        } catch (error) {
          return cb(error);
        }
      }
    )
  );

  //Usamos los middleware de passport para configurar:
  passport.use(
    "jwt", //el primer parametro va el nombre de la estrategia
    new JWTStrategy( //instancia de nuestra estrategia
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtracto]), //Extrae la informacion que necesita de la request: utilizamos el cookieExtractor
        secretOrKey: envs.CODE_SECRET,
      },
      async (jwt_payload, done) => {
        //funcion callback, que es asincrona
        try {
          return done(null, jwt_payload); //en el primer parametro null ya que no hay ningun error
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialización y deserialización de usuarios
    /*
    La serialización y deserialización de usuarios es un proceso que nos permite almacenar y recuperar información del usuario en la sesión.
    La serialización es el proceso de convertir un objeto de usuario en un identificador único.
    La deserialización es el proceso de recuperar un objeto de usuario a partir de un identificador único.
    Los datos del user se almacenan en la sesión y se recuperan en cada petición.
    */

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userRepository.getById(id);
    done(null, user);
  });
};

export default initializePassport;

// Google
/* 
https://www.passportjs.org/packages/passport-google-oauth20/
https://console.developers.google.com/
https://developers.google.com/identity/protocols/oauth2/scopes

*/