const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const Discord = require('discord.js');
const duration = require('humanize-duration');
module.exports = {
    name: "rob",
    aliases: ["robar"],
    desc: "Sirve para robar dinero a un usuario",
    run: async (client, message, args, prefix) => {
        if(!args.length)return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`❌ | **Especifica un usuario!** | ❌`)
                .setDescription(`**Tienes que especificar el usuario a robar!**`)
                ]
        })
        //aseguro la base de datos del usuario a robar
        const usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if(!usuario)return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`❌ | **No se ha encontrado el usuario.** | ❌`)
                .setDescription(`**No se ha encontrado el usuario que has especificado!**`)
                ]
        })
        await asegurar_todo(null, usuario.id);
        let data = await ecoSchema.findOne({userID: message.author.id});
        let tiempo_ms = 3 * 60 * 1000;
        if(tiempo_ms - (Date.now() - data.rob) > 0) {
            let tiempo_restante = duration(Date.now() - data.rob - tiempo_ms,
            {
                languaje: "es",
                units: ["h", "m", "s"],
                round: true,
            })
            return message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`❌ | **No puedes hacer esto!** | ❌`)
                    .setDescription(`**Tienes que esperar \`${tiempo_restante}\` para volver a usar este comando!**`)
                ]
            })
        }
        let data_usuario = await ecoSchema.findOne({userID: usuario.id});
        if(data_usuario.dinero < 500)return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`⛔ | **No puedes robarle a este usuario!** | ⛔`)
                .setDescription(`**No puedes robar menos de \`500 monedas\`**`)
            ]
        })
        let cantidad = Math.floor(Math.random() * 50) + 100
        //comprobaciones previas
        if(cantidad > data_usuario.dinero)return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`⛔ | **Hey!** | ⛔`)
                .setDescription(`El usuario a robar no tiene tanto dinero!`)
            ]
        })
        //procedo a robarle al otro usuario c:
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                dinero: -cantidad,
            }, 
            rob: Date.now()
        })
        //le quito las monedas al usuario C:
        await ecoSchema.findOneAndUpdate({userID: usuario.id}, {
            $inc: {
                dinero: -cantidad,
            },
        })
        return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`✅ | **Le has robado a ${usuario.user.tag}!** | ✅`)
                .setDescription(`Has robado \`${cantidad}\` de monedas a ${usuario.user.tag}`)
            ]
        })
    }
}