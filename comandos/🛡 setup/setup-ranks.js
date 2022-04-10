const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setup.js`);

module.exports = {
    name: "setup-rank",
    aliases: ["setup-ranking", "setup-niveles", "setup-niveles", "setup-levels", "setup-level", "setup-ranks"],
    desc: "Sirve para crear un sistema de niveles",
    permisos: ["MANAGE_CHANNELS"],
    run: async (client, message, args, prefix) => {
        const canalNotificaciones = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!canalNotificaciones)return message.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle("❌ | **No has especificado un canal.** | ❌")
            .setDescription("Tienes que especificar un canal para las notificaciones al subir de nivel!")
            ]
        })
        const mensaje = args.slice(1).join(" ").substring(0, 2048);
        if(!mensaje)return message.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle("❌ | **No has especificado un mensaje.** | ❌")
            .setDescription("Tienes que especificar un mensaje para cuando un usuario sube de nivel!")
            .setColor(client.color)
            ]
        })

        await setupSchema.findOneAndUpdate({guildID: message.guild.id}, {
            niveles: {
                canal: canalNotificaciones.id,
                mensaje
            }
        })

        return message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle("✅ | **Sistema de niveles activado.** | ✅")
                .setDescription(`Enviare las notificaciones cuando un usuario suba de nivel en ${canalNotificaciones}!`)
                .setColor(client.color)
                ]
        })
    }
}