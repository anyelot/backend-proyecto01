const Usuario = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const createUser = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ mensaje: 'Correo ya registrado' });

    const nuevoUsuario = new Usuario({ nombre, correo, contraseña });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario._id);

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error interno' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario || !usuario.habilitado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado o inhabilitado' });
    }

    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = generarToken(usuario._id);

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        permisos: usuario.permisos
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en login' });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const usuario = req.usuario; // el usuario autenticado
    const { id } = req.params;

    if (usuario._id.toString() !== id && !usuario.permisos.modificarUsuarios) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este usuario' });
    }

    const camposActualizables = ['nombre', 'correo', 'permisos'];
    const actualizaciones = {};

    camposActualizables.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        actualizaciones[campo] = req.body[campo];
      }
    });

    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, actualizaciones, {
      new: true
    });

    if (!usuarioActualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({
      mensaje: 'Usuario actualizado',
      usuario: {
        id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        correo: usuarioActualizado.correo,
        permisos: usuarioActualizado.permisos
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

const inhabilitarUsuario = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { id } = req.params;

    if (usuario._id.toString() !== id && !usuario.permisos.inhabilitarUsuarios) {
      return res.status(403).json({ mensaje: 'No tienes permiso para inhabilitar este usuario' });
    }

    const usuarioInhabilitado = await Usuario.findByIdAndUpdate(
      id,
      { habilitado: false },
      { new: true }
    );

    if (!usuarioInhabilitado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({ mensaje: 'Usuario inhabilitado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al inhabilitar usuario' });
  }
};

module.exports = {
  createUser,
  loginUser,
  actualizarUsuario,
  inhabilitarUsuario
};
