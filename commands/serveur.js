module.exports = {
  // ----------------------------------------------------------------------------------
  // PROPRIETE DE LA COMMANDE
  name: "serveur",
  description: "Affiche le serveur",
  options: [{
    name: "serveur",
    description: "Selectionner le serveur a afficher",
    type: "STRING",
    required: false,
    choices: [{
      name: "survie",
      value: "survie"
    }, {
      name: "creatif",
      value: "creatif"
    }, {
      name: "mini-jeux",
      value: "minijeux"
    }, {
      name: "pepiniere",
      value: "pepiniere"
    }, {
      name: "snapshot",
      value: "snapshot"
    }]
  }],
  sample: "serveur survie",
  accessableby: "all",
  async execute(props) {
    // ----------------------------------------------------------------------------------
    // VARIABLES
    const Canvas = require('canvas'); // CANVAS SERT POUR LA CREATION D'IMAGE
    const Axios = require('axios'); // Axios SERT LES DEMANDES D'API PLUS SIMPLE
    const FastAverageColor = require('fast-average-color-node'); // SERT A GÉNÉRER UNE COULEUR SELON UNE IMAGE
    const MessageButton = props.buttons; // LES BOUTONS DISCORD
    const MessageActionRow = props.actionrow;
    const Discord = props.discord; // RECUPERATION DE DISCORD
    const bot = props.bot;
    const int = props.interaction; // RECUPERATION DE LA DEMANDE DE LA COMMANDE
    const functions = props.functions;
    const config = props.config;
    var serveur;
    var link;
    var home_id = "home_" + Math.floor(Math.random() * 100000);
    var players_id = "players_" + Math.floor(Math.random() * 100000);
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // SELECTION DE L'IP
    if (!int.options.get("serveur")) { // SI YA DES OPTIONS DEFINI AVEC LA COMMANDE
      serveur = "vanilla.play-mc.fr"; // LES METTRE A JOUR
      link = "https://play-mc.fr/survie.html";
    } else {
      switch (int.options.get("serveur").value) {
        case "survie":
          serveur = "vanilla.play-mc.fr";
          link = "https://play-mc.fr/survie.html"
          break;
        case "creatif":
          serveur = "crea.play-mc.fr";
          link = "https://play-mc.fr/crea.html"
          break;
        case "minijeux":
          serveur = "mini-jeux.play-mc.fr";
          link = "https://play-mc.fr/pepiniere.html"
          break;
        case "pepiniere":
          serveur = "pepiniere.play-mc.fr";
          link = "https://play-mc.fr/pepiniere.html"
          break;
        case "snapshot":
          serveur = "snapshot.play-mc.fr";
          link = "https://play-mc.fr/snapshot.html"
          break;
      }
    }
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // BOUTONS
    var buttons = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomID(home_id)
        .setLabel("Information")
        .setDisabled(true)
        .setStyle('SECONDARY'))
      .addComponents(new MessageButton()
        .setCustomID(players_id)
        .setLabel("Liste des joueurs")
        .setStyle('SECONDARY'))
      .addComponents(new MessageButton()
        .setStyle('LINK')
        .setLabel("Site")
        .setURL(link))
    // -------------------------------------------------------------------------------snapshot---

    console.log("----------------------------------------");
    console.log("SERVEUR par " + int.member.user.username);
    console.log("----------------------------------------");
    int.defer();

    // ----------------------------------------------------------------------------------
    // RÉCUPERATION DES DONNÉES
    const data_request = await Axios.get("https://api.mcsrvstat.us/2/" + serveur);
    var data = data_request.data;
    if (!data.online) { // SI SERVEUR OFFLINE
      let error_embed = new Discord.MessageEmbed()
        .setColor(config.error_color).setTitle("❌ Erreur")
        .setDescription("```Le serveur " + int.options.get("serveur").value + " est offline\n" + serveur + "```")
        .setImage("https://media.discordapp.net/attachments/675387087649767426/854804575018024960/void.png")
      int.editReply({
        embeds: [error_embed]
      })
      return;
    }
    var icon_buffer = new Buffer.from(data.icon.split(",")[1], "base64");
    var attachment = new Discord.MessageAttachment(icon_buffer, 'icon.png');
    var color = await FastAverageColor.getAverageColor(icon_buffer);
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // CRÉATION DES EMBEDS
    let software;
    if (data.software) {
      software = data.software;
    } else {
      software = "";
    }
    var home_embed = new Discord.MessageEmbed()
      .setColor(color.value)
      .setTitle(serveur)
      .setThumbnail("attachment://icon.png")
      .setDescription("```" + data.motd.clean.join("\n") + "```")
      .addField("Détails", "Joueur: " + data.players.online + "/" + data.players.max + "\nVersion: " + software + " " + data.version + "\n")
      .addField("IP", serveur + "\n" + data.ip + ":" + data.port)
      .setImage("https://media.discordapp.net/attachments/675387087649767426/854804575018024960/void.png")
      .setFooter("Page 1/2 \xa0•\xa0 Informations")
    var players_embed = new Discord.MessageEmbed()
      .setColor(color.value)
      .setTitle(serveur)
      .setDescription("```" + data.motd.clean.join("\n") + "```")
      .setThumbnail("attachment://icon.png")
      .setImage("https://media.discordapp.net/attachments/675387087649767426/854804575018024960/void.png")
      .setFooter("Page 2/2 \xa0•\xa0 Liste des joueurs")
    var player1 = [];
    var player2 = [];
    if (data.players.online > 5 && data.players.online <= 10) {
      player1 = data.players.list.slice(0, 5);
      player2 = data.players.list.slice(5);
      players_embed.addField("List des joueurs", " • " + Discord.escapeMarkdown(player1.join("\n• ")), true);
      players_embed.addField("_ _ ", " • " + Discord.escapeMarkdown(player2.join("\n• ")), true);
    } else if (data.players.online > 10) {
      player1 = data.players.list;
      player2 = data.players.list;
      player3 = data.players.list;
      player1 = player1.slice(0, 5);
      player2 = player2.slice(5, 10);
      player3 = player3.slice(10, 12);
      player3.push("[...]");
      players_embed.addField("List des joueurs", " • " + Discord.escapeMarkdown(player1.join("\n• ")), true);
      players_embed.addField("_ _ ", " • " + Discord.escapeMarkdown(player2.join("\n• ")), true);
      players_embed.addField("_ _ ", " • " + Discord.escapeMarkdown(player3.join("\n• ")), true);
    } else if (data.players.online > 0) {
      player1 = data.players.online;
      players_embed.addField("_ _ ", " • " + Discord.escapeMarkdown(player1.join("\n• ")), true);
    } else {
      players_embed.addField("List des joueurs", "Aucun joueur 😕");
    }
    players_embed.addField("Total", data.players.online + "/" + data.players.max)
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // ENVOIS DU MESSAGE
    int.editReply({
      ephemeral: false,
      embeds: [home_embed],
      files: [attachment],
      components: [buttons]
    })
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // DÉTECTION D'UNE INTERACTION (APPUIS SUR BOUTON)
    bot.on("interaction", int => {
      if (!int.isMessageComponent() && int.componentType !== 'BUTTON') return;
      if (int.customID !== home_id && int.customID !== players_id) return;
      functions.enableAllButtons(buttons.components);
      if (int.customID == players_id) {
        buttons.components[1].setDisabled(true);
        int.message.edit({
          ephemeral: false,
          embeds: [players_embed],
          files: [attachment],
          components: [buttons]
        }).then(function() {
          int.deferUpdate();
        })
      }
      if (int.customID == home_id) {
        buttons.components[0].setDisabled(true);
        int.message.edit({
          ephemeral: false,
          embeds: [home_embed],
          files: [attachment],
          components: [buttons]
        }).then(function() {
          int.deferUpdate();
        })
      }
    })
    // ----------------------------------------------------------------------------------

  },
};
