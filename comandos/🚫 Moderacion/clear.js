const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

  module.exports = {
    name: "clear", 

  run (client, message, args, prefix){
        //comprobando permisos
        if(!message.member.permissions.has("MANAGE_MESSAGES"))return message.reply({
        embeds: [new MessageEmbed()
            .setTitle(`❌ |  Error.  |  ❌`)
            .setDescription(`**No tienes suficientes permisos para hacer esto!**`)
            .setColor(client.color)
            .setTimestamp()
        ]
    })
    if(!message.guild.me.permissions.has("MANAGE_MESSAGES"))return message.reply({
        embeds: [new MessageEmbed()
            .setTitle(`❌ |  Error.  |  ❌`)
            .setDescription(`**No tengo los permisos suficientes para hacer esto!\nPermisos faltantes \`MANAGE_MESSAGES\`**`)
            .setColor(client.color)
            .setTimestamp()
        ]
    })
 
        const cantidad = args[0]

        if(!cantidad) return message.reply({
            embeds: [new MessageEmbed()
                .setTitle(`❌ |  Error.  |  ❌`)
                .setDescription(`**Debes escribir una cantidad de mensajes para eliminar.**`)
                .setColor(client.color)
                .setTimestamp()
            ]
        })

        if(isNaN(cantidad)) return message.reply({
            embeds: [new MessageEmbed()
                .setTitle(`❌ |  Error.  |  ❌`)
                .setDescription(`** Debes escribir una cantidad de mensajes para eliminar.**`)
                .setColor(client.color)
                .setTimestamp()
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true})})
            ]
        })

        if(cantidad > 99) return message.reply({
            embeds: [new MessageEmbed()
            .setTitle(`⛔ |  Error.  | ⛔`)
            .setDescription(`**Has pasado el límite, max 99 mensajes.**`)
            .setColor(client.color)
            .setTimestamp()
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true})})
        ]
        })

        if(cantidad < 1) return message.reply({
            embeds: [new MessageEmbed()
                .setTitle(`⛔ |  Error.  | ⛔`)
                .setDescription(`**No puedes borrar menos de 1 mensaje.**`)
                .setColor(client.color)
                .setTimestamp()
            ]
        })

        message.delete().then(q => {
            message.channel.bulkDelete(cantidad, true)
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle(`✅  |  **Mensajes borrados.** | ✅`)
                    .setDescription(`**Se han borrado ${cantidad} de mensajes exitosamente.**`)
                    .setColor(client.color)
                    .setTimestamp()
                    .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true})})
                ]
            })
        })
    }
}