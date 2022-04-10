const mongoose = require('mongoose');

const tickets = new mongoose.Schema({
    ID: {type: String, default: "sorteos"},
    autor: String,
    canal: String,
    cerrado: {type: Boolean, default: false}
})

const model = mongoose.model("Tickets_Creados", tickets);

module.exports = model;