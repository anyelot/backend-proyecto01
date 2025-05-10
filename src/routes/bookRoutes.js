const express = require('express');
const router = express.Router();
const {
  crearLibro,
  obtenerLibroPorId,
  obtenerLibros,
  actualizarLibro,
  inhabilitarLibro
} = require('../controllers/bookController');
const protegerRuta = require('../middleWare/authMiddleware');

router.post('/', protegerRuta, crearLibro);
router.get('/', obtenerLibros);
router.get('/:id', obtenerLibroPorId);
router.put('/:id', protegerRuta, actualizarLibro); 
router.delete('/:id', protegerRuta, inhabilitarLibro);

module.exports = router;