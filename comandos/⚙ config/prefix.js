const schema = require(`${process.cwd()}/modelos/servidor.js`)
module.exports = {
    name: "prefix",
    aliases: ["prefijo", "cambiarprefijo", "cambiarprefix"],
    permisos: ["ADMINISTRATOR"],
    desc: "Sirve para cambiar el Preijo del Bot en el Servidor",
    run: async (client, message, args, prefix) => {
        if(message.member.permissions.has('ADMINISTRATOR'))
        if(!args[0]) return message.reply(`❌ Tienes que especificar el prefijo nuevo para el Bot!`)
        await schema.findOneAndUpdate({guildID: message.guild.id}, {
            prefijo: args[0]
        })
        return message.reply(`✅ Has cambiado el Prefijo de \`${prefix}\` a \`${args[0]}\``)
    }
}