const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');

const protegerRuta = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado: token requerido' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario || !usuario.habilitado) {
      return res.status(403).json({ mensaje: 'Usuario inválido o inhabilitado' });
    }

    req.usuario = usuario;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};

module.exports = protegerRuta;