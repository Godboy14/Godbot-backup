const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const duration = require('humanize-duration');
const Discord = require('discord.js');
var trabajos = [
    "Camionero",
    "Taxista",
    "Vendedor de helados",
    "Mecanico",
    "Programador",
    "Plomero",
]

module.exports = {
    name: "work",
    aliases: ["trabajar"],
    desc: "Sirve para trabajar y conseguir monedas cada 3 minutos",
    run: async (client, message, args, prefix) => {
        //leemos la economia el usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        //definimos cada cuanto tiempo se puede ejecutar el comando EN MS
        let tiempo_ms = 0.03 * 60 * 60 * 1000;
        //definimos la recompensa
        let recompensa = Math.floor(Math.random() * 800) + 200;
        //defino el trabajo
        let trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];
        //comprobaciones previas
        if(tiempo_ms - (Date.now() - data.work) > 0) {
            let tiempo_restante = duration(Date.now() - data.work - tiempo_ms,
            {
                language: "es",
                units: ["h", "m", "s"],
                round: true,
            })
            return message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`💰 | **No se ha podido reclamar.** | 💰`)
                    .setDescription(`🕑 **Tienes que esperar \`${tiempo_restante}\` para volver a reclamar tu recompensa diaria!**`)
                ]
            }
        )}
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                dinero: recompensa
            },
            work: Date.now()
        })
        return message.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle(`💰 | **Has trabajado.** | 💰`)
            .setDescription(`**Has trabajado como \`${trabajo}\` y has recibido una recompensa de \`${recompensa} monedas\`!**`)
            ]
        }
    )}
}