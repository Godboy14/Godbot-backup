const config = require(`${process.cwd()}/config/config.json`)
const serverSchema = require(`${process.cwd()}/modelos/servidor.js`)
const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`)
const { MessageEmbed } = require("discord.js")
module.exports = async (client, message) => {
    if (!message.guild || !message.channel || message.author.bot) return;
    await asegurar_todo(message.guild.id, message.author.id);
    let data = await serverSchema.findOne({guildID: message.guild.id})
    if (!message.content.startsWith(data.prefijo)) return;
    const args = message.content.slice(data.prefijo.length).trim().split(" ");
    const cmd = args.shift()?.toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    if (command) {
        if(command.permisos_bot){
            if(!message.guild.me.permissions.has(command.permisos_bot)) return message.reply({
                embeds: [new MessageEmbed()
                .setTitle(`❌ | **Error.** | ❌`)
                .setDescription(`No cuento con los permisos suficientes para ejecutar este comando! Necesito los permisos ${command.permisos_bot.map(permiso => `\`${permiso}\``).join(", ")} `)
                ]
            })
        }

        if(command.permisos){
            if(!message.member.permissions.has(command.permisos)) return message.reply({
                embeds: [new MessageEmbed()
                .setTitle(`❌ | No tienes suficientes permisos! | ❌`)
                .setDescription(`No tienes suficientes permisos para ejecutar este comando, necesitas los permisos ${command.permisos.map(permiso => `\`${permiso}\``).join(", ")}`)
                ]
            })
        }
        //ejecutar el comando
        command.run(client, message, args, data.prefijo);
    } else {
        //opcional
        return message.reply({
            embeds: [new MessageEmbed()
                .setTitle(`❌ |  Error.  |  ❌`)
                .setDescription(`**No he encontrado el comando que me has especificado!**`)
                .setColor(client.color)
                .setTimestamp()
            ]
        })
    }

}