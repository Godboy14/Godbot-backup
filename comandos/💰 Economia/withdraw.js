const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const Discord = require('discord.js');
module.exports = {
    name: "withdraw",
    aliases: ["depositar", "sacar"],
    desc: "Sirve para guardar tu dinero en el banco",
    run: async (client, message, args, prefix) => {
        await asegurar_todo(null, message.author.id);
        let data = await ecoSchema.findOne({userID: message.author.id});
        let cantidad = args[0];
        //comprobaciones previas
        if(["todo", "all-in", "all"].includes(args[0])) {
            cantidad = data.banco
        } else {
            if(isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`❌ | **No es una cantidad valida.** | ❌`)
                .setDescription(`No has especificado una cantidad valida para depositar!`)
                ]
            })
            if(cantidad > data.banco) return message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`⛔ | **No tienes suficiente dinero.** | ⛔`)
                .setDescription(`**No tienes tanto dinero para depositar!**`)
                ]
            })
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                banco: -cantidad,
                dinero: cantidad
            }
        });
        return message.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle(`💰 | **Transacción hecha.** | 💰`)
            .setDescription(`**Has sacado \`${cantidad} de dinero de tu banco\`**`)
            ]
        })

    }
}