var mongoose = require('mongoose');

var MenuSchema   = new mongoose.Schema({
  data: Date,
  almoco: Boolean,
  principal: String,
  guarnicao: String,
  salada: String,
  sobremesa: String,
  principalVegetariano: String, 
  guarnicaoVegetariano: String
});

module.exports = mongoose.model('Menu', MenuSchema);