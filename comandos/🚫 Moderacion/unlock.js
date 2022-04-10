const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
module.exports = {
    name: 'unlock',
    desc: 'Sive para desbloquear un canal.',
    permisos: ["ADMINISTRATOR"],
    run: async (client, message, args, prefix) => {
     
        const everyone = message.guild.roles.cache.find(r => r.name === "@everyone")

        message.channel.permissionOverwrites.edit(everyone, { SEND_MESSAGES: true})

        const embed = new MessageEmbed()
        .setTitle("Canal desbloqueado.")
        .setDescription(`${message.channel} a sido desbloqueado`)
        .setColor(client.color)
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true})})

        await message.channel.send({ embeds: [embed]})
    }
}