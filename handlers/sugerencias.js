const setupSchema = require(`${process.cwd()}/modelos/setup.js`);
const votosSchema = require(`${process.cwd()}/modelos/votos-sugs.js`);
const { asegurar_todo } = require(`${process.cwd()}/handlers/funciones.js`);
const Discord = require('discord.js');
module.exports = client => {
    //evento al hacer click en un botón de la sugerencia
    client.on("interactionCreate", async interaction => {
        try {
            //comprobaciones previas
            if (!interaction.guild || !interaction.channel || !interaction.message || !interaction.user) return;
            //aseguramos la base de datos
            asegurar_todo(interaction.guild.id, interaction.user.id);
            //buscamos los datos en la base de datos
            let setup_data = await setupSchema.findOne({ guildID: interaction.guild.id });
            //buscamos la base de datos del mensaje de la sugerencia
            let msg_data = await votosSchema.findOne({ messageID: interaction.message.id });
            //comprobaciones previas
            if (!msg_data || !setup_data || !setup_data.sugerencias || interaction.channelId !== setup_data.sugerencias) return;
            switch (interaction.customId) {
                case "votar_si": {
                    //si el votante ya ha votado en el mismo voto hacemos return;
                    if (msg_data.si.includes(interaction.user.id)) return interaction.reply({ content: `Ya has votado SÍ en la sugerencia de <@${msg_data.autor}>`, ephemeral: true});
                    //modificamos la DB
                    if (msg_data.no.includes(interaction.user.id)) msg_data.no.splice(msg_data.no.indexOf(interaction.user.id), 1)
                    msg_data.si.push(interaction.user.id);
                    msg_data.save();

                    //modificamos el embed
                    interaction.message.embeds[0].fields[0].value = `${msg_data.si.length} votos`;
                    interaction.message.embeds[0].fields[1].value = `${msg_data.no.length} votos`;

                    //modificamos los botones con el valor de los votos
                    interaction.message.components[0].components[0].label = msg_data.si.length.toString();
                    interaction.message.components[0].components[1].label = msg_data.no.length.toString();

                    //editamos el mensaje
                    await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                    interaction.deferUpdate();
                }
                    break;
                
                    case "responder_sug": {
                        if(!interaction.member.permissions.has('MANAGE_CHANNELS'))return interaction.reply({
                            embeds: [new Discord.MessageEmbed()
                            .setTitle(`❌ | **Error.** | ❌`)
                            .setDescription(`**No tienes suficientes permisos para realizar esto!**`)
                            ], ephemeral: true
                        })
                        interaction.reply({ content: 'Quieres aceptar o rechazar la sugerencia? (aceptar/rechazar)', ephemeral: true });
                        let filtro = (m) => m.author.id === interaction.user.id;
                        let aceptdeny = await interaction.channel.awaitMessages({
                            filter: filtro,
                            max: 1,
                        });
                        let rsug = aceptdeny.first().content;
                        aceptdeny.first().delete();
    
                        if (rsug !== 'aceptar' && rsug !== 'rechazar') return interaction.reply({ content: 'Solo puedes aceptar o rechazar', ephemeral: true });
    
                        if (rsug === 'aceptar') {
                            interaction.followUp({ content: 'razon?', ephemeral: true })
                            let aceptar = await interaction.channel.awaitMessages({
                                filter: filtro,
                                max: 1,
                            });
                            let elpepe = aceptar.first().content;
                            aceptar.first().delete();
                            interaction.message.embeds[0].addField('Estado: Aceptado', `**${interaction.user.username}**: ${elpepe}`, true);
                            interaction.message.embeds[0].color = 'GREEN';
                            interaction.message.components[0].components[0].disabled = true;
                            interaction.message.components[0].components[1].disabled = true;
                            interaction.message.components[0].components[3].disabled = true;
    
                        
     await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                        } else if (rsug === 'rechazar') {
                            interaction.followUp({ content: 'razon?', ephemeral: true })
                            let rechazar = await interaction.channel.awaitMessages({
                                filter: filtro,
                                max: 1,
                            });
                            let elpepe = rechazar.first().content;
                            rechazar.first().delete();
                            interaction.message.embeds[0].addField('Estado: Rechazado', `**${interaction.user.username}**: ${elpepe}`, true);
                            interaction.message.embeds[0].color = 'RED';
                            interaction.message.components[0].components[0].disabled = true;
                            interaction.message.components[0].components[1].disabled = true;
                            interaction.message.components[0].components[3].disabled = true;
    
                            await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                        }
                    }
                        break;

                case "votar_no": {
                    //si el votante ya ha votado en el mismo voto hacemos return;
                    if (msg_data.no.includes(interaction.user.id)) return interaction.reply({ content: `Ya has votado SÍ en la sugerencia de <@${msg_data.autor}>` , ephemeral: true});
                    //modificamos la DB
                    if (msg_data.si.includes(interaction.user.id)) msg_data.si.splice(msg_data.si.indexOf(interaction.user.id), 1)
                    msg_data.no.push(interaction.user.id);
                    msg_data.save();

                    //modificamos el embed
                    interaction.message.embeds[0].fields[0].value = `${msg_data.si.length} votos`;
                    interaction.message.embeds[0].fields[1].value = `${msg_data.no.length} votos`;

                    //modificamos los botones con el valor de los votos
                    interaction.message.components[0].components[0].label = msg_data.si.length.toString();
                    interaction.message.components[0].components[1].label = msg_data.no.length.toString();

                    //editamos el mensaje
                    await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                    interaction.deferUpdate();

                }
                    break;
                    
                case "ver_votos": {
                    interaction.reply({
                        embeds: [new Discord.MessageEmbed()
                        .setTitle(`Votos de la sugerencia`)
                        .addField(`✅ Votos positivos`, msg_data.si.length >= 1 ? msg_data.si.map(u => `<@${u}>\n`).toString() : "No hay votos", true)
                        .addField(`❌ Votos negativos`, msg_data.no.length >= 1 ? msg_data.no.map(u => `<@${u}>\n`).toString() : "No hay votos", true)
                        .setColor(client.color)
                        ],
                        ephemeral: true,
                    })
                    
                }

                break;

                case "votar_no": {
                    //si el votante ya ha votado en el mismo voto hacemos return;
                    if (msg_data.no.includes(interaction.user.id)) return interaction.reply({ content: `Ya has votado SÍ en la sugerencia de <@${msg_data.autor}>` , ephemeral: true});
                    //modificamos la DB
                    if (msg_data.si.includes(interaction.user.id)) msg_data.si.splice(msg_data.si.indexOf(interaction.user.id), 1)
                    msg_data.no.push(interaction.user.id);
                    msg_data.save();

                    //modificamos el embed
                    interaction.message.embeds[0].fields[0].value = `${msg_data.si.length} votos`;
                    interaction.message.embeds[0].fields[1].value = `${msg_data.no.length} votos`;

                    //modificamos los botones con el valor de los votos
                    interaction.message.components[0].components[0].label = msg_data.si.length.toString();
                    interaction.message.components[0].components[1].label = msg_data.no.length.toString();

                    //editamos el mensaje
                    await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                    interaction.deferUpdate();

                }
                    break;

                default:
                    break;
            }
        } catch (e) { console.log(e) }
    })
}