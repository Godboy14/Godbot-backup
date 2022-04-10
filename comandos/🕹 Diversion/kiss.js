const Discord = require('discord.js')
const db = require('megadb')
const beso = new db.crearDB('beso')
const anime = require('anime-actions')

module.exports = {
  name: "kiss",
  alias: ["besar", "beso"],
  timeout: 1000 * 3,
  owner: false,
  permissions: [],
  botpermissions: [],
  descripcion: "Besas a la persona mencionada.",
  run: async(client, message, args, prefix) =>{
    let aA = message.author;
     
     let aB = message.mentions.users.first()
     if(!aB) return message.reply({
         embeds: [new Discord.MessageEmbed()
        .setTitle(`❌ | **Error.** | ❌`)
        .setDescription(`Necesitas mencionar a una persona.`)
        ]
     })

     if(!beso.tiene(`${aA.id}.${aB.id}`)){
         beso.establecer(`${aA.id}.${aB.id}.cant`, 0)
       }
      
      beso.sumar(`${aA.id}.${aB.id}.cant`, 1)

      const besos = await beso.obtener(`${aA.id}.${aB.id}.cant`)
    if(!beso.tiene(`${aB.id}.${aA.id}`)){
         beso.establecer(`${aB.id}.${aA.id}.cant`, 0)
       }
      
      beso.sumar(`${aB.id}.${aA.id}.cant`, 1)

     const aC = new Discord.MessageEmbed()
     .setDescription(`**${aA.username}** beso a **${aB.username}**`)
     .setFooter(`Este par de tortolos se han dado: ${besos} beso(s) en total.`)
     .setImage(await anime.kiss())
     .setColor(client.color)
     message.reply({ embeds: [aC] })
  }
}