const Discord = require("discord.js")

module.exports = {
  name: "setup-embeds",
  aliases: ["embed", "setup-embed"],
  desc: "Inicia el proceso de los embeds",
  permisos: ["MANAGE_CHANNELS"],
  permisos_bot: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
  run: async (client, message, args, prefix) => {
    var objeto = {
      canal: "",
      mensaje1: "",
  };

    const quecanal = await message.channel.send({
      embeds: [new Discord.MessageEmbed()
          .setTitle("¿Que canal quieres usar para el embed?")
          .setDescription("Simplemente menciona el canal o envia su ID")
          .setColor(client.color)
          ]
    });

    await quecanal.channel.awaitMessages({
      filter: m=> m.author.id === message.author.id, 
      max: 1,
      errors: ["time"],
      time: 180e3,
  }).then(async collected => {
    var message = collected.first();
    const channel = message.guild.channels.cache.get(message.content) || message.mentions.channels.first();
    if(channel) {
      objeto.canal = channel.id;
        const quemensaje = await message.channel.send({
        embeds: [new Discord.MessageEmbed()
        .setTitle("¿Que titulo le quieres poner al embed?")
        .setDescription("Simplemente envía el mensaje!")
        .setColor(client.color)
        ]
      });
      await quemensaje.channel.awaitMessages({
        filter: m=> m.author.id === message.author.id, 
        max: 1,
        errors: ["time"],
        time: 180e3,
    }).then(async collected => {
      var message1 = collected.first();
      const msg = (message.content)
        if(msg){
          objeto.canal = channel.id;
          const quedesc = await message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setTitle("¿Que mensaje descripción quieres usar para el embed?")
                .setDescription("Simplemente envía el mensaje!")
                .setColor(client.color)
                ]
          });
          await quedesc.channel.awaitMessages({
            filter: m=> m.author.id === message.author.id, 
            max: 1,
            errors: ["time"],
            time: 180e3,
        }).then(async collected => {
          var message2 = collected.first();
          const msg1 = await message.guild.channels.cache.get(objeto.canal).send({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`${message1.content.substring(0, 2048)}`)
                .setDescription(`${message2.content.substring(0, 2048)}`)
                .setColor(client.color)
                ],
             })
             return message.reply({ content: `✅ **Embed configurado, en: <#${objeto.canal}>**`, ephemeral: true })
            }).catch(() => {
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setTitle("❌ **El tiempo ha expirado!**")
                    ],
                 })
              })
           }
      })
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
            .setTitle("❌ **No se ha encontrado el canal que has especificado!**")
            ],
         })
  }

  }).catch(() => {
    return message.reply({
      embeds: [new Discord.MessageEmbed()
          .setTitle("❌ **El tiempo ha expirado!**")
          ],
       })
    })
}

}