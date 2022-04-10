const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const Discord = require('discord.js');
module.exports = {
    name: "dep",
    aliases: ["depositar"],
    desc: "Sirve para guardar tu dinero en el banco",
    run: async (client, message, args, prefix) => {
        await asegurar_todo(null, message.author.id);
        let data = await ecoSchema.findOne({userID: message.author.id});
        let cantidad = args[0];
        //comprobaciones previas
        if(["todo", "all-in", "all"].includes(args[0])) {
            cantidad = data.dinero
        } else {
            if(isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`❌ | **No es una cantidad valida.** | ❌`)
                .setDescription(`No has especificado una cantidad valida para depositar!`)
                ]
            })
            if(cantidad > data.dinero) return message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`⛔ | **No tienes suficiente dinero.** | ⛔`)
                .setDescription(`**No tienes tanto dinero para depositar!**`)
                ]
            })
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                dinero: -cantidad,
                banco: cantidad
            }
        });
        return message.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle(`💰 | **Transacción realizada.** | 💰`)
            .setDescription(`**Has depositado \`${cantidad} de dinero en tu banco\`**`)
            ]
        })

    }
}