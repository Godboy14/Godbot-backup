const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setup.js`);
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "setup-suggestion",
    aliases: ["suggestion-setup", "setup-sugerencias", "setup-sugerencia", "setupsugerencias"],
    desc: "Sirve para crear un sistema de Sugerencias",
    permisos: ["MANAGE_CHANNELS"],
    permisos_bot: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
    run: async (client, message, args, prefix) => {
        if(!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply('❌**No tienes suficientes permisos!**')
        if(!args.length) return message.reply("❌ **Tienes que especificar el canal de sugerencias!**")
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!channel || channel.type !== "GUILD_TEXT") return message.reply("❌ **El canal de sugerencias que has mencionado no existe!**");
        setupSchema.findOne({ guildID: message.guild.id }, async (err, data) => {
            if (data) data.delete();
            new setupSchema({
                guildID: message.guild.id,
                sugerencias: channel.id,
            }).save();
            return message.reply({
                embeds: [new MessageEmbed()
                    .setTitle(`✅ Establecido el canal de sugerencias a \`${channel.name}\``)
                    .setDescription(`*Cada vez que una persona envíe un mensaje en ${channel}, lo convertiré a sugerencia!*`)
                    .setColor(client.color)
                ]
            })
        });
    }
}