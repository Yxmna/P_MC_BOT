module.exports = {
  // ----------------------------------------------------------------------------------
  // PROPRIETE DE LA COMMANDE
  name: "compte",
  description: "Défini ton compte minecraft",
  options: [{
    name: "pseudo",
    type: "STRING",
    description: "Ton pseudo minecraft",
    required: true
  }],
  sample: "compte Yomna",
  accessableby: "all",
  async execute(props) {
    // ----------------------------------------------------------------------------------
    // VARIABLES
    const axios = require('axios'); // AXIOS SERT A TELECHARGER LES IMAGES & POUR LES DEMANDES D'API PLUS SIMPLE
    const Discord = props.discord; // RECUPERATION DE DISCORD
    const int = props.interaction; // RECUPERATION DE LA DEMANDE DE LA COMMANDE
    const bot = props.bot; // RECUPERATION DU BOT
    const options = int.options; // RECUPERATION DES OPTIONS DE CETTE COMMANDE
    const MessageButton = props.buttons;
    const MessageActionRow = props.actionrow;
    const config = props.config;
    var name;
    var uuid;
    var bad_skin_render;
    var discord_name;
    var discord_id;
    var oldname;
    var yes_id = "yes_" + Math.floor(Math.random() * 100000);
    var no_id = "no_" + Math.floor(Math.random() * 100000);
    var confirm_id = "confirm_" + Math.floor(Math.random() * 100000);
    var reject_id = "reject_" + Math.floor(Math.random() * 100000);
    var data;
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // BOUTONS ET EMBEDS
    var player_embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setFooter("Une fois confirmé, vous devrez attendre qu'un membre du staff le valide", int.guild.iconURL())
    var staff_embed = new Discord.MessageEmbed()
      .setColor(config.color)
    var error_embed = new Discord.MessageEmbed()
      .setColor(config.error_color)
    var confirmed_embed = new Discord.MessageEmbed()
      .setColor(config.color)
    var reload_embed = new Discord.MessageEmbed()
      .setColor(config.color)
    var reloadstaff_embed = new Discord.MessageEmbed()
      .setColor(config.color)
    const staff_button = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomID(confirm_id)
        .setLabel("Confirmer")
        .setStyle('SUCCESS'))
      .addComponents(new MessageButton()
        .setCustomID(reject_id)
        .setLabel("Rejeter")
        .setStyle('DANGER'))
    const player_button = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomID(yes_id)
        .setLabel("Oui")
        .setStyle('SUCCESS'))
      .addComponents(new MessageButton()
        .setCustomID(no_id)
        .setLabel("Non")
        .setStyle('DANGER'))
    // ----------------------------------------------------------------------------------

    name = int.options.get("pseudo").value;

    // ----------------------------------------------------------------------------------
    // TELECHARGEMENT DES INFOS
    try { // TESTE SI COMPTE MINECRAFT EXISTE
      const uuid_request = await axios.get("https://api.mojang.com/users/profiles/minecraft/" + name); //DEMANDE DE L'UUID A PARTIR DU PSEUDO
      uuid = uuid_request.data.id;
      if (!uuid) throw "err";
      name = uuid_request.data.name;
      bad_skin_render = "https://crafatar.com/renders/body/" + uuid + "?overlay"
      if (int.member.nickname) { // SI LE COMPTE A ETE RENOMMER
        discord_name = int.member.nickname; // RECUPERATION DU PSEUDO AVEC LE SURNOM
      } else { // SI PAS DE SURNOM
        discord_name = int.user.username; // RECUPERATION DU PSEUDO AVEC LE PSEUDO DISCORD
      }

      if (int.member.nickname && int.member.nickname != name) {
        try {
          let oldname_request = await axios.get("https://api.mojang.com/user/profiles/" + uuid + "/names");
          oldname = oldname_request.data;
          oldname = oldname[oldname.length - 2].name;
          if (oldname == int.member.nickname) {
            int.member.setNickname(name).then(function() {
              reload_embed.setTitle("Pseudo actualisé ✅")
                .setDescription("`" + oldname + "` ➡️ `" + name + "`")
              int.reply({
                embeds: [reload_embed]
              });
              // int.guild.channels.cache.find(channel => channel.id = config.channel_staff).send("<@" + int.member + "> (" + oldname + ") a actualisé son pseudo en " + name)
            })
            return;
          }
        } catch (e) {
          console.log(e);
        }
      } else if (int.user.username == name || int.member.nickname == name) {

        int.member.setNickname(name).then(function() {
          reload_embed.setTitle("Pseudo actualisé ✅")
            .setDescription("`" + int.user.username + "` ➡️ `" + name + "`")
          int.reply({
            embeds: [reload_embed]
          });

        })
        return;

      }

      console.log(int.user.username);
      console.log(name);

      player_embed.setAuthor(discord_name + ",", int.member.user.avatarURL())
      player_embed.setTitle("`" + name + "` est bien votre compte minecraft ?")
      player_embed.addField("UUID", uuid)
      player_embed.addField("_ _", "[Cliquez ici](https://fr.namemc.com/profile/" + uuid + ") pour voir le compte plus en détail")
      player_embed.setThumbnail(bad_skin_render)

      int.reply({
        ephemeral: false,
        embeds: [player_embed],
        components: [player_button]
      });

    } catch (e) { // SI ERREUR
      console.log("> Compte minecraft non trouvé");
      // ENVOIS DE L'EMBED
      error_embed.setAuthor(name + " ❌")
        .setTitle("Aucun compte minecraft trouvé avec le pseudo `" + name + "`")
      int.reply({
        ephemeral: false,
        embeds: [error_embed]
      })
      return;
    }


    bot.on("interaction", interaction => {
      if (!interaction.isMessageComponent() && interaction.componentType !== 'BUTTON') return;
      if (interaction.customID !== yes_id && interaction.customID !== no_id && interaction.customID !== confirm_id && interaction.customID !== reject_id) return;


      if (interaction.customID == yes_id && interaction.user.id == int.user.id) {
        staff_embed.setAuthor(discord_name + ",", int.member.user.avatarURL())
          .setTitle("Demande à être associé au compte `" + name + "`")
          .addField("DISCORD", "<@" + int.member + "> (" + int.user.tag + ")")
          .addField("UUID", uuid)
          .addField("Changement de pseudo", "`" + discord_name.split(" (")[0] + "` ➡️ `" + name + "`")
          .addField("_ _", "[Cliquez ici](https://fr.namemc.com/profile/" + uuid + ") pour voir le compte plus en détail")
          .setThumbnail(bad_skin_render)

        int.guild.channels.cache.find(channel => channel.id = config.channel_staff).send({
          ephemeral: false,
          embeds: [staff_embed],
          components: [staff_button]
        }).then(function() {
          interaction.message.edit({
            content: "Ta demande a bien été envoyé",
            ephemeral: false,
            embeds: [],
            components: []
          })
        })
      }



      if (interaction.customID == no_id) {
        interaction.message.delete();
      }

      if (interaction.customID == confirm_id) {
        confirmed_embed.setAuthor(discord_name + ",", int.member.user.avatarURL())
          .setTitle("✅ A bien été renommé en `" + name + "`")
          .addField("DISCORD", "<@" + int.member + "> (" + int.user.tag + ")")
          .addField("UUID", uuid)
          .addField("Changement apporté", "`" + discord_name + "` ➡️ `" + name + "`")
          .addField("Confirmé par", "<@" + interaction.member + ">")
          .addField("_ _", "[Cliquez ici](https://fr.namemc.com/profile/" + uuid + ") pour voir le compte plus en détail")
          .setThumbnail(bad_skin_render)
        int.member.setNickname(name).then(function() {
          interaction.message.edit({
            ephemeral: false,
            embeds: [confirmed_embed],
            components: []
          })
        })
      }



    });









  },
};
