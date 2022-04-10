const mongoose = require('mongoose');
const config = require('../../config/config.json');
module.exports = client => {
    //Nos conectamos a la base de datos

    let palo = 53;

    mongoose.connect(config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║       Conectado a la base de datos de MONGODB!      ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.blue)
    }).catch((err) => {
        console.log(`☁ ERROR AL CONECTAR A LA BASE DE DATOS DE MONGODB`.blue);
        console.log(err)
    })

    console.log(`╔═════════════════════════════════════════════════════╗`.white)
    console.log(`║ `.white + " ".repeat(-1 + palo - 1) + " ║".white)
    console.log(`║ `.white + `      Conectado como ${client.user.tag}`.white + " ".repeat(-1 + palo - 1 - `      Conectado como ${client.user.tag}`.length) + " ║".green)
    console.log(`║ `.white + " ".repeat(-1 + palo - 1) + " ║".white)
    console.log(`╚═════════════════════════════════════════════════════╝`.white)
    const estados = [`${client.guilds.cache.size} Servers | ${client.users.cache.size} Usuarios Activos`, ">>help"]

    setInterval(() => {
     client.user.setPresence({
         activities: [{
             name:  estados[Math.floor(Math.random() * estados.length)],
             type: "WATCHING"
         }],
         status: "on"
     })
    }, 10000);
}