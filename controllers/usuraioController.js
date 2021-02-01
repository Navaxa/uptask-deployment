const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCurearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombreProyecto: 'Crear una cuante en Uptask'
    })
}

exports.crearCuenta = async (req, res) => {
    const { email, password } = req.body;

    try {


        await Usuarios.create({
            email,
            password
        });
    
        // crear una URL para confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        // crear el objecto del usuario
        const usuario = {
            email
        }
        // enviar email
        await enviarEmail.enviar({
            email: usuario.email,
            subject: 'confirma tu cuenta en UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
          })
        // redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch(errores) {
        req.flash('error', errores.errors.map( err => err.message) );
        res.render('crearCuenta', {
            nombreProyecto: 'Crear una cuante en Uptask',
            mensajes: req.flash(),
            email: email,
            password: password
        });
    }

}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes
    console.log(error);
    res.render('iniciarSesion', {
        nombreProyecto: 'Iniciar sesion en Uptask',
        error
    });
}

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombreProyecto: 'Restablecer tu contraseña'
    });
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if(!usuario) {
        req.flash('error', 'Operación no valida');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;

    await usuario.save();

    req.flash('correcto', 'Ya puedes iniciar sesión, tu cuenta esta activa');
    res.redirect('/iniciar-sesion');
}