const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'lock',
    desc: 'Sirve para bloquear un canal.',
    permisos: ["ADMINISTRATOR"],
    run: async (client, message, args, prefix) => {
     
        const everyone = message.guild.roles.cache.find(r => r.name === "@everyone")

        message.channel.permissionOverwrites.edit(everyone, { SEND_MESSAGES: false})

        const embed = new MessageEmbed()
        .setTitle("Canal bloqueado.")
        .setDescription(`${message.channel} a sido bloqueado`)
        .setColor(client.color)
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true})})
        await message.channel.send({ embeds: [embed]})
    }
}