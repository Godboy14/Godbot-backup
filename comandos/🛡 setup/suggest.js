const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setup.js`);
const votosSchema = require(`${process.cwd()}/modelos/votos-sugs.js`)

module.exports = {
    name: "sugerencia",
    aliases: ["suggestion", "suggest", "sugerir"],
    desc: "Sirve para mandar una sugerencia",
    run: async (client, message, args, prefix) => {
            try {
                if (!message.guild || !message.channel || message.author.bot) return;
                let setup_data = await setupSchema.findOne({ guildID: message.guild.id });
                if (
                !setup_data ||
                !setup_data.sugerencias ||
                !message.guild.channels.cache.get(setup_data.sugerencias)
                ) return;
                message.delete().catch(() => { });
                let botones = new Discord.MessageActionRow().addComponents([
                //votar si
                new Discord.MessageButton().setStyle("SECONDARY").setLabel("0").setEmoji("✅").setCustomId("votar_si"),
                //votar no
                new Discord.MessageButton().setStyle("SECONDARY").setLabel("0").setEmoji("❌").setCustomId("votar_no"),
                //ver votanes
                new Discord.MessageButton().setStyle("PRIMARY").setLabel("¿Quién ha votado?").setEmoji("❓").setCustomId("ver_votos"),
                    //responde a una sugerencia
                new Discord.MessageButton().setStyle("PRIMARY").setLabel("Responder Sugerencia").setCustomId("responder_sug"),
                ])
                let msg = await message.guild.channels.cache.get(setup_data.sugerencias).send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor({ name: "Sugerencia de " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`>>> ${args.join(' ')}`)
                            .addField(`✅ Votos positivos`, "0 votos", true)
                            .addField(`❌ Votos negativos`, "0 votos", true)
                            .setColor(client.color)
                    ],
                    components: [botones]
                })
                let data_msg = new votosSchema({
                    messageID: msg.id,
                    autor: message.author.id,
                })
                data_msg.save();
            } catch (e) { console.log(e) }
    }
}