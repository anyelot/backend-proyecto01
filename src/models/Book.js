const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  autor: { type: String, required: true },
  genero: { type: String },
  editorial: { type: String },
  fechaPublicacion: { type: Date },
  disponible: { type: Boolean, default: true },
  habilitado: { type: Boolean, default: true },
  historialReservas: [
    {
      usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
      fechaReserva: Date,
      fechaEntrega: Date
    }
  ]
});

module.exports = mongoose.model('Libro', bookSchema);