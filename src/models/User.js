const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  permisos: {
    crearLibros: { type: Boolean, default: false },
    modificarLibros: { type: Boolean, default: false },
    inhabilitarLibros: { type: Boolean, default: false },
    modificarUsuarios: { type: Boolean, default: false },
    inhabilitarUsuarios: { type: Boolean, default: false }
  },
  habilitado: { type: Boolean, default: true },
  historialReservas: [
    {
      libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },
      fechaReserva: Date,
      fechaEntrega: Date
    }
  ]
});

// Hash de contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

module.exports = mongoose.model('Usuario', userSchema);