module.exports = {
  // ----------------------------------------------------------------------------------
  // PROPRIETE DE LA COMMANDES
  name: "profile",
  description: "Affiche ton profile",
  options: [{
    name: "pseudo",
    type: "STRING",
    description: "Affiche le profile d'un joueur spécifique avec son pseudo Minecraft",
    required: false
  }],
  sample: "profile Yomna",
  accessableby: "all",
  async execute(props) {
    // ----------------------------------------------------------------------------------
    // VARIABLES
    const Sqlite3 = require("sqlite3"); // SQLITE SERT POUR LA BASE DE DONNÉES
    const Canvas = require('canvas'); // CANVAS SERT POUR LA CRÉATION D'IMAGE
    const Axios = require('axios'); // AXIOS SERT LES DEMANDES D'API PLUS SIMPLE
    const Puppeteer = require('puppeteer'); // PUPPETEER SERT A RÉCUPERER DES DONNÉES SUR LES SITES WEB (CHUT)
    const FastAverageColor = require('fast-average-color-node'); // SERT A GÉNÉRER UNE COULEUR SELON UNE IMAGE
    const MessageButton = props.buttons; // LES BOUTONS DISCORD
    const MessageActionRow = props.actionrow;
    const Discord = props.discord;
    const int = props.interaction; // LES VARIABLES STOCKÉ DANS L'OBJET
    const bot = props.bot;
    const functions = props.functions;
    const config = props.config;
    var data = {}; // TOUT LES DONNÉES SERONT STOCKÉ ICI LE TEMPS DE LA COMMANDE
    var name = ""; // LES AUTRES VARIABLES GLOBALS
    var theta = 30;
    var phi = 21;
    var version = "1.2";
    const db = new Sqlite3.Database("../assets/players.db"); // RÉCUPERATION DE LA BASE DE DONNÉES
    var update = false // PAR DEFAULT, LES INFO NO SERONT PAS MIS A JOUR
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // BOUTONS ET EMBEDS
    var profile_id = "home_" + Math.floor(Math.random() * 100000); // CRÉATION D'UN ID DIFFÉRENT POUR CHAQUES BOUTONS POUR ÉVITER DE TOUT EMMÊLER
    var skin_id = "names_" + Math.floor(Math.random() * 100000);
    var names_id = "names_" + Math.floor(Math.random() * 100000);
    var discord_id = "names_" + Math.floor(Math.random() * 100000);
    var view_id = "view_" + Math.floor(Math.random() * 100000);
    var up_id = "up_" + Math.floor(Math.random() * 100000);
    var down_id = "down_" + Math.floor(Math.random() * 100000);
    var left_id = "left_" + Math.floor(Math.random() * 100000);
    var right_id = "right_" + Math.floor(Math.random() * 100000);
    var back_id = "back_" + Math.floor(Math.random() * 100000);
    var error_embed = new Discord.MessageEmbed() // CRÉATION DES DIFFÉRENT EMBED POUR CHAQUES ONGLETS
      .setColor(config.error_color)
      .setAuthor("❌ Erreur")
      .setImage("https://media.discordapp.net/attachments/850784713534865440/855051245273481216/image.jpg")
    var profile_embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setAuthor(name)
      .setTitle("Profile Minecraft")
      .setDescription("```_ _```")
      .setImage("https://media.discordapp.net/attachments/675387087649767426/854804575018024960/void.png")
      .setFooter("Page 1/4 \xa0•\xa0 Minecraft")
    var skin_embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setAuthor(name)
      .setTitle("Informations sur le skin")
      .setDescription("```_ _```")
      .setImage("https://media.discordapp.net/attachments/675387087649767426/854804575018024960/void.png")
      .setFooter("Page 2/4 \xa0•\xa0 Skin")
    var names_embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setAuthor(name)
      .setTitle("Listes des pseudos")
      .setDescription("```_ _```")
      .setImage("https://media.discordapp.net/attachments/675387087649767426/854804575018024960/void.png")
      .setFooter("Page 3/4 \xa0•\xa0 Pseudos")
    var discord_embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setAuthor(name)
      .setTitle("Profile Discord")
      .setDescription("```_ _```")
      .setImage("https://media.discordapp.net/attachments/675387087649767426/854804575018024960/void.png")
      .setFooter("Page 4/4 \xa0•\xa0 Discord")
    var buttons = new MessageActionRow() // CRÉATION DES BOUTONS
      .addComponents(new MessageButton()
        .setCustomID(profile_id)
        .setStyle('SECONDARY')
        .setLabel("Profile")
        .setDisabled(true))
      .addComponents(new MessageButton()
        .setCustomID(skin_id)
        .setStyle('SECONDARY')
        .setLabel("Skin"))
      .addComponents(new MessageButton()
        .setCustomID(names_id)
        .setStyle('SECONDARY')
        .setLabel("Pseudo"))
    var controls = new MessageActionRow()
      .addComponents(new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji("🔼")
        .setCustomID(up_id))
      .addComponents(new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji("🔽")
        .setCustomID(down_id))
      .addComponents(new MessageButton()
        .setStyle('SECONDARY')
        .setCustomID(left_id)
        .setEmoji("◀️"))
      .addComponents(new MessageButton()
        .setStyle('SECONDARY')
        .setCustomID(right_id)
        .setEmoji("▶️"))
      .addComponents(new MessageButton()
        .setStyle('PRIMARY')
        .setCustomID(back_id)
        .setLabel("Retour"))
    var skin_buttons = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomID(profile_id)
        .setStyle('SECONDARY')
        .setLabel("Profile"))
      .addComponents(new MessageButton()
        .setCustomID(skin_id)
        .setStyle('SECONDARY')
        .setLabel("Skin")
        .setDisabled(true))
      .addComponents(new MessageButton()
        .setCustomID(names_id)
        .setStyle('SECONDARY')
        .setLabel("Pseudo"))
    // ----------------------------------------------------------------------------------

    console.log("----------------------------------------");
    console.log("PROFILE par " + int.member.user.username);
    console.log("----------------------------------------");
    int.defer(); // MIS EN ATTENTE DE LA COMMANDE CAR LA RÉPONSE RISQUE D'ÊTRE LONGUE

    // ----------------------------------------------------------------------------------
    // RÉCUPÉRATION DU PSEUDO
    console.log("> Récupération du pseudo ...");
    if (int.options.get("pseudo")) { // SI UN PSEUDO A ÉTÉ DONNÉ
      name = int.options.get("pseudo").value.split(" -u")[0]; // STOCKAGE DU PSEUDO
      if (int.options.get("pseudo").value.split(" -u").length > 1) update = true; // SI LA MISE A JOUR EST DEMANDÉ
    } else { // SI PAS DE PSEUDO
      if (int.member.nickname) { // SI LE COMPTE A ÉTÉ RENOMMÉ
        name = int.member.nickname; // RÉCUPÉRATION DU PSEUDO AVEC LE SURNOM
      } else { // SI PAS DE SURNOM
        name = int.user.username; // RÉCUPÉRATION DU PSEUDO AVEC LE PSEUDO DISCORD
      }
    }
    console.log("✔ Pseudo: " + name);
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // ÉTAPE COMPTE DISCORD
    console.log("> Vérification d'un compte discord ...");
    if (int.guild.members.cache.find(member => member.nickname?.toLowerCase() == name.toLowerCase() || member.user.username.toLowerCase() == name.toLowerCase())) { // SI UN COMPTE DISCORD EST TROUVÉ
      console.log("✔ Compte discord trouvé");
      try { // CRÉATION DE L'EMBED DISCORD
        let member = int.guild.members.cache.find(member => member.nickname?.toLowerCase() == name.toLowerCase() || member.user.username.toLowerCase() == name.toLowerCase());
        let discord_topic = "Joueur de Play-mc.fr";
        if (member.user.presence.activities[0]) { // SI UN STATUS EST DETECTÉ
          let discord_activity = member.user.presence.activities[0];
          switch (discord_activity.type) { // MIS A JOUR DU STATUS SELON LE TYPE
            case "PLAYING":
              discord_topic = "Joue à " + discord_activity.name + " 🎮";
              break;
            case "STREAMING":
              discord_topic = "Steam " + discord_activity.name; // JSP COMMENT CA VA RENDRE J'AI PERSONNE POUR TESTER AIDEZ MOIIIII
              break;
            case "LISTENING":
              discord_topic = "Écoute " + discord_activity.details + " de " + discord_activity.state + " 🎵";
              break;
            case "WATCHING":
              discord_topic = "Regarde " + discord_activity.name;
              break;
            case "CUSTOM_STATUS":
              if (discord_activity.emoji) {
                if (discord_activity.state) {
                  discord_topic = discord_activity.emoji.name + " " + discord_activity.state;
                } else {
                  discord_topic = discord_activity.emoji.name;
                }
              } else {
                discord_topic = discord_activity.state;
              }
              break;
            case "COMPETING":
              // JSP C QUOIIII ;-;
              break;
          }
        }
        name = member.user.username; // RE MIS A JOUR DU PSEUDO POUR LES BONNES MAJ
        if (member.nickname) name = member.nickname; // RE RE MIS A JOUR DU PSEUDO SI YA UN SURNOM
        data["discord_tag"] = member.user.tag; // ENVOIS DE TOUTES LES DONNÉES DANS DATA
        data["discord_id"] = member.user.id;
        data["discord_join"] = member.joinedAt
        data["discord_date"] = member.user.createdAt;
        data["discord_avatar"] = member.user.avatarURL();
        data["discord_topic"] = discord_topic;
      } catch (e) { // SI UNE ERREUR
        console.log(e);
        error_embed.setDescription("```" + String(e) + "```"); // MODIFICATION DE L'EMBED ERREUR SELON LA DESCRIPTION DE L'ERREUR
        int.editReply({ // ENVOIS DE L'ERREUR
          embeds: [error_embed]
        });
        console.log("----------------------------------------");
        console.log();
        return; // ARRET DE LA COMMANDE
      } // SI PAS D'ERREUR
      buttons // AJOUT DU BOUTON DISCORD
        .addComponents(new MessageButton()
          .setCustomID(discord_id)
          .setStyle('SECONDARY')
          .setLabel("Discord"))
      skin_buttons
        .addComponents(new MessageButton()
          .setCustomID(discord_id)
          .setStyle('SECONDARY')
          .setLabel("Discord"))
        .addComponents(new MessageButton()
          .setCustomID(view_id)
          .setStyle('PRIMARY')
          .setLabel("Controler"))
    } else { // SI PAS DE COMPTE DISCORD TROUVÉ
      skin_buttons
        .addComponents(new MessageButton()
          .setCustomID(view_id)
          .setStyle('PRIMARY')
          .setLabel("Controler"))
      console.log("✖ Compte discord non trouvé");
      data["discord_tag"] = "";
      data["discord_id"] = "";
      data["discord_join"] = "";
      data["discord_date"] = "";
      data["discord_avatar"] = "";
      data["discord_topic"] = "Joueur minecraft";
    }
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // ÉTAPE COMPTE MINECRAFT
    console.log("> Vérification d'un compte minecraft ...");
    db.get("SELECT * FROM players WHERE name = ?", name, async (err, db_data) => { // VÉRIFICATION DANS LA BASE DE DONNÉES
      if (db_data && db_data.version !== version) { // SI LES DONNÉES STOCKÉ PROVIENNE D'UNE ANCIENNE VERSION DE LA COMMANDE
        update = true; // FORCAGE DE LA MISE A JOUR
        console.log("✖ Ancienne version");
      }
      if (db_data && Math.abs(new Date(db_data.date) - new Date()) / 86400000 > 30) { // SI 30 JOURS EST PASSÉ DEPUIS LA DERNIÈRE COMMANDE
        console.log("✖ Date expiré");
        update = true; // FORCAGE DE LA MISE A JOUR
      }
      if (db_data) {
        try { // VÉRIFICATION DES IMAGES STOCKÉS
          let test_request = await Axios.get(db_data.render);
          let result = test_request.statusText;
        } catch (e) { // SI L'IMAGE N'EST PLUS DISPONIBLE
          console.log("✖ Image expiré");
          update = true; // FORCAGE DE LA MIS A JOUR
        }
      }
      if (db_data && !update) { // SI DONNÉES TROUVÉ DANS LA BASE DE DONNÉES & PAS DE MISE A JOUR
        console.log("✔ Compte minecraft trouvé dans la base de données");
        Object.keys(db_data).forEach(key => { // STOCKAGE DE TOUTES LES DONNÉES DANS DATA
          data[key] = db_data[key];
        });
        data.minecraft_players_used_skin = data.minecraft_players_used_skin.split(","); // MODIFICATION DE QUELQUES DONNÉES
        data.discord_date = new Date(data.discord_date);
        data.discord_join = new Date(data.discord_join);
        sendEmbed(); // CRÉATION DES EMBED ET ENVOIS
      } else { // SI PAS DE DONNÉES DANS LA BASE DE DONNÉES OU MISE A JOUR ACTIVÉ
        try { // VÉRIFICATION D'UN COMPTE MINECRAFT
          let uuid_request = await Axios.get("https://api.mojang.com/users/profiles/minecraft/" + name); // REQUETE DE l'UUID A PARTIR DU PSEUDO
          data["minecraft_uuid"] = uuid_request.data.id.toLowerCase(); // SAUVEGARDE DE L'UUID SI SUCCES
        } catch (e) { // SI PAS DE COMPTE MINECRAFT
          console.log("✖ Compte minecraft non trouvé");
          error_embed // MISE A JOUR DE L'EMBED ERREUR
            .setAuthor("❌ Aucun joueur trouvé")
            .setTitle("`" + name + "`")
            .setImage("https://media.discordapp.net/attachments/680846177687568393/854786470082248704/image.png");
          int.editReply({ // ENVOIS DE L'EMBED ERREUR
            embeds: [error_embed]
          });
          console.log("----------------------------------------");
          console.log();
          return;
        } // SI COMPTE MINECRAFT TROUVÉ
        console.log("✔ Compte minecraft trouvé non enregistré");
        try {
          let skin_url = await getProfileData(data["minecraft_uuid"]); // RÉCUPERATION DES DONNÉES DE PROFILE
          await getSkinData(skin_url); // RÉCUPERATION DES DONNÉES DU SKIN
          sendEmbed(); // CRÉATION DES EMBED ET ENVOIS
        } catch (e) { // SI ERREUR
          console.log(e);
          error_embed.setDescription("```" + String(e) + "```"); // MISE A JOUR DE L'EMBED ERREUR
          int.editReply({ // ENVOIS DE L'EMBED ERREUR
            embeds: [error_embed]
          });
          console.log("----------------------------------------");
          console.log();
          return; // STOP DE LA COMMANDE
        }
      }
    });
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // FONCTION POUR LA CRÉATION ET ENVOIS DES EMBEDS FINAUX
    async function sendEmbed() {
      console.log("> Création et envois des embeds ...");
      data["version"] = version;
      // MIS A JOUR DES L'EMBED PROFILE
      let vues = data.namemc_views + " vues / mois"
      if (data.namemc_views < 2) vues = data.namemc_views + " vue / mois"
      let cape = "";
      switch (data.minecraft_cape) {
        case 0:
          cape = "";
          break;
        case 1:
          cape = "\nCape officiel ✅";
          break;
        case 2:
          cape = "\nCape optifine ✔️";
          break;
      }
      profile_embed
        .setAuthor(data.name, data.discord_avatar)
        .setDescription("```" + data.discord_topic + "```\nPseudo: " + data.name + "\nUUID: " + data.minecraft_uuid + "\nSkin total: " + data.minecraft_skin_count + "\nPseudo total: " + data.minecraft_name_count + cape + "\n[" + vues + "](https://fr.namemc.com/profile/" + data.minecraft_uuid + ")")
        .setThumbnail("attachment://thumbnail.png")
        .setImage("attachment://image.jpg")
      // MISE A JOUR DE L'EMBED SKIN
      let account = data.minecraft_time_skin_used + " compte";
      if (data.minecraft_time_skin_used > 1) account = data.minecraft_time_skin_used + " comptes";
      let skin_account1 = [];
      let skin_account2 = [];
      data.minecraft_players_used_skin.forEach((item, i) => {
        if (i < 4) {
          skin_account1.push(item);
        } else {
          skin_account2.push(item);
        }
      });
      skin_embed
        .setAuthor(data.name, data.discord_avatar)
        .setDescription("```" + data.discord_topic + "```\nSkin: `" + data.minecraft_skin_hash + "` `" + data.minecraft_skin_type + "`\n[Liens du skin](https://fr.namemc.com/skin/" + data.minecraft_skin_hash + ")\n")
        .setImage("https://render.namemc.com/skin/3d/body.png?skin=" + data.minecraft_skin_hash + "&model=" + data.minecraft_skin_type + "&theta=30&phi=21&time=90&width=400&height=300")
        .addField("Utilisé par " + account, " • " + Discord.escapeMarkdown(skin_account1.join("\n • ")), true)
      if (skin_account2.length > 0) {
        skin_embed.addField("_ _", " • " + skin_account2.join("\n • "), true)
      }
      // MISE A JOUR DE L'EMBED PSEUDOS
      let names_request = await Axios.get("https://api.mojang.com/user/profiles/" + data.minecraft_uuid + "/names");
      let names = names_request.data;
      let init = names.shift().name;
      names_embed
        .setAuthor(data.name, data.discord_avatar)
        .setDescription("```" + data.discord_topic + "```\n" + "`" + init + "` Pseudo initial\n" + names.map(element => "`" + element.name + "` Changé le " + new Date(element.changedToAt).getDate() + "/" + (new Date(element.changedToAt).getMonth() + 1) + "/" + (new Date(element.changedToAt).getFullYear()) + " il y a " + functions.readDate(new Date(element.changedToAt))).join("\n"), true)
      // MISE A JOUR DE L'EMBED DISCORD
      if (data.discord_id) {
        discord_embed
          .setAuthor(data.name, data.discord_avatar)
          .setDescription("```" + data.discord_topic + "```\nTag: " + data.discord_tag + "\nID: " + data.discord_id + "\nCompte crée le " + data.discord_date.toLocaleDateString('fr-FR') + "\n • Il y a " + functions.readDate(data.discord_date) + "\nA rejoin le discord le " + data.discord_join.toLocaleDateString('fr-FR') + "\n • Il y a " + functions.readDate(data.discord_join))
          .setThumbnail(data.discord_avatar)
      }

      let image_attachment;
      let thumbnail_attachment;

      if (data.render) { // SI LES IMAGES EXISTES
        profile_embed.setImage(data.render); // AJOUT DES IMAGES AVEC LES COULEURS
        profile_embed.setThumbnail(data.thumbnail);
        profile_embed.setColor(data.color);
        names_embed.setColor(data.color);
        skin_embed.setColor(data.color);
        discord_embed.setColor(data.color);
        // ENVOIS DE L'EMBED
        int.editReply({
          embeds: [profile_embed],
          components: [buttons]
        }).then(async function(result) {
          console.log("✔ Embeds envoyé");
          console.log("----------------------------------------");
          console.log();
        })
      } else { // SI LES IMAGES EXISTE PAS
        // CREATION DE L'IMAGE DU SKIN DE DEVANT
        let skin_front_request = await Axios.get("https://render.namemc.com/skin/3d/body.png?skin=" + data.minecraft_skin_hash + "&model=" + data.minecraft_skin_type + "&theta=30&phi=0&time=0&width=200&height=250.png", {
          responseType: 'arraybuffer'
        })
        let skin_front_buffer = Buffer.from(skin_front_request.data, "utf-8")
        // CREATION DE L'IMGE DU SKIN DE DERRIERE
        let skin_back_request = await Axios.get("https://render.namemc.com/skin/3d/body.png?skin=" + data.minecraft_skin_hash + "&model=" + data.minecraft_skin_type + "&theta=-150&phi=0&time=0&width=175&height=219.png", {
          responseType: 'arraybuffer'
        })
        let skin_back_buffer = Buffer.from(skin_back_request.data, "utf-8")
        // CREATION DE L'IMGE DU SKIN EN AVATAR
        let thumbnail_request = await Axios.get("https://render.namemc.com/skin/3d/body.png?skin=" + data.minecraft_skin_hash + "&model=" + data.minecraft_skin_type + "&theta=0&phi=7&time=0&width=500&height=500.png", {
          responseType: 'arraybuffer'
        })
        let thumbnail_buffer = Buffer.from(thumbnail_request.data, "utf-8");
        // ZONE PHOTOSHOP, CREATION DU MAGNIFIQUE RENDU DU SKIN (C LA FRANCE)
        let image_canvas = Canvas.createCanvas(400, 269); // PETITE FEUILLE DE DESSIN
        let image_context = image_canvas.getContext('2d');
        let shadow = await Canvas.loadImage("./shadow.png"); // RÉCUPÉRATION DE l'IMAGE AVEC LES OMBRES
        let skin_front = await Canvas.loadImage(skin_front_buffer); // RÉCUPÉRATION DE l'IMAGE DU SKIN DE DEVANT
        let skin_back = await Canvas.loadImage(skin_back_buffer); // RÉCUPÉRATION DE l'IMAGE DU SKIN DE DERRIERE
        image_context.drawImage(shadow, 0, 0, 400, 275); // ASSEMBLAGE DE TOUTES LES IMAGES
        image_context.drawImage(skin_back, 20, 12, 175, 219);
        image_context.drawImage(skin_front, 195, 0, 200, 250);
        image_attachment = new Discord.MessageAttachment(image_canvas.toBuffer(), "image.jpg"); // ENREGISTREMENT DE L'IMAGE FINAL DANS UN FICHIER DISCORD
        // PAREIL POUR L'AVATAR
        let thumbnail_canvas = Canvas.createCanvas(150, 150);
        let thumbnail_context = thumbnail_canvas.getContext('2d');
        let thumbnail = await Canvas.loadImage(thumbnail_buffer);
        thumbnail_context.drawImage(thumbnail, -175, -20, 500, 500);
        thumbnail_attachment = new Discord.MessageAttachment(thumbnail_canvas.toBuffer(), "thumbnail.png");
        // GÉNÉRATION DE LA COULEUR SELON L'AVATAR
        let color = await FastAverageColor.getAverageColor(thumbnail_canvas.toBuffer());
        data["color"] = color.hex;
        profile_embed.setColor(color.value);
        names_embed.setColor(color.value);
        skin_embed.setColor(color.value);
        discord_embed.setColor(color.value);
        // ENVOIS DE L'EMBED
        int.editReply({
          embeds: [profile_embed],
          components: [buttons],
          files: [image_attachment, thumbnail_attachment]
        }).then(async function(result) {
          console.log("✔ Embeds envoyé");
          data["render"] = result.embeds[0].image.url; // ENREGISTREMENT DES LIENS DES IMAGES GÉNÉRÉ
          data["thumbnail"] = result.embeds[0].thumbnail.url;
          profile_embed.setImage(data.render); // MIS A JOUR DES EMBEDS AVEC LES LIENS
          profile_embed.setThumbnail(data.thumbnail);
          let discord_date; // CRÉATION DE QUELQUES VARIABLES AFIN DE TOUT SAUVEGARDER ENSUITE
          let discord_join;
          if (data.discord_id) {
            discord_date = data.discord_date.toLocaleDateString('fr-FR');
            discord_join = data.discord_join.toLocaleDateString('fr-FR');
          }
          let date = new Date().toLocaleDateString("en-US");
          // SAUVEGARDE DES INFORMATIONS DANS LA BASE DE DONNÉES AFIN D'ÉVITER DE RE TOUT TÉLÉCHARGER LA PROCHAINE FOIS
          if (update) { // SI C'EST UNE MISE A JOUR, ALORS ON MET SIMPLEMENT A JOUR
            db.run(`UPDATE players SET date = ?,version = ?, color = ?, minecraft_uuid = ?, render = ?, thumbnail = ?, minecraft_skin_hash = ?, minecraft_skin_type = ?, minecraft_time_skin_used = ?, minecraft_cape = ?, minecraft_name_count = ?, minecraft_skin_count = ?, namemc_views = ?, minecraft_players_used_skin = ?, discord_id = ?, discord_tag = ?, discord_date = ?, discord_join = ?, discord_avatar = ?, discord_topic = ? WHERE name = ? `, date, data.version, data.color, data.minecraft_uuid, data.render, data.thumbnail, data.minecraft_skin_hash, data.minecraft_skin_type, data.minecraft_time_skin_used, data.minecraft_cape, data.minecraft_name_count, data.minecraft_skin_count, data.namemc_views, data.minecraft_players_used_skin, data.discord_id, data.discord_tag, discord_date, discord_join, data.discord_avatar, data.discord_topic, name, function(err) {
              if (err) {
                console.log("----------------------------------------");
                console.log();
                return console.log(err.message);
              }
              console.log("✔ Données a jour");
              console.log("----------------------------------------");
              console.log();
            });
          } else { // SI CE N'EST PAS UNE MISE A JOUR, RAJOUT DES DONNÉES DANS LA BASE DE DONNÉES
            db.run(`INSERT INTO players(date, version, color, name, minecraft_uuid, render, thumbnail, minecraft_skin_hash, minecraft_skin_type, minecraft_time_skin_used, minecraft_cape, minecraft_name_count, minecraft_skin_count, namemc_views, minecraft_players_used_skin, discord_id, discord_tag, discord_date, discord_join, discord_avatar, discord_topic) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, date, data.version, data.color, data.name, data.minecraft_uuid, data.render, data.thumbnail, data.minecraft_skin_hash, data.minecraft_skin_type, data.minecraft_time_skin_used, data.minecraft_cape, data.minecraft_name_count, data.minecraft_skin_count, data.namemc_views, data.minecraft_players_used_skin, data.discord_id, data.discord_tag, discord_date, discord_join, data.discord_avatar, data.discord_topic, function(err) {
              if (err) {
                console.log("----------------------------------------");
                console.log();
                return console.log(err.message);
              }
              console.log("✔ Données ajouté");
              console.log("----------------------------------------");
              console.log();
            });
          }
          db.close(); // FERMETURE DE LA BASE DE DONNE, OUF
        })
      }
    }
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // FONCTION POUR LA RÉCUPÉRATION DES DONNÉES DU SKIN
    async function getSkinData(url) {
      console.log("> Récupération du skin ...");
      let browser = await Puppeteer.launch({ // CRÉATION D'UN NAVIGATEUR INTERNET
        headless: true
      });
      let page = await browser.newPage(); // NOUVEAU ONGLET
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
      await page.goto(url); // OUVERTURE DU LIENS
      let skin_data = await page.evaluate(() => { // RÉCUPERATION DES DONNÉES SUR LA PAGE
        let skin_type = document.querySelector("#render-button").href.split("model=")[1].split("&")[0]; // TYPE DE SKIN
        let skin_hash = document.querySelector("#render-button").href.split("skin=")[1].split("&")[0]; // ID DU SKIN
        if (document.querySelector("div.col-md-6:nth-child(1) > div:nth-child(3) > div:nth-child(1) > strong:nth-child(1)")) {
          var time_skin_used = document.querySelector("div.col-md-6:nth-child(1) > div:nth-child(3) > div:nth-child(1) > strong:nth-child(1)").innerHTML?.split("(")[1].split(")")[0]; // NOMBRE DE PERSONNE QUI ONT UTILISÉ LE SKIN
        } else {
          var time_skin_used = document.querySelector("h5.position-absolute").innerHTML?.split("★")[1]; // NOMBRE DE PERSONNE QUI ONT UTILISÉ LE SKIN
        }
        let players_used_skin = Array.from(document.querySelectorAll(".player-list > a")).map(element => element.innerHTML.split("<img")[0]) // LISTE DES COMPTES QUI ONT UTILISÉ LE SKIN
        if (players_used_skin.length > 8) { // SAUVEGARDE DE SEULEMENT 8 COMPTES MAX
          players_used_skin.length = 7;
          players_used_skin.push("[...]");
        }
        return { // SAUVEGARDE SOUS FORME D'OBJET
          skin_hash: skin_hash,
          skin_type: skin_type,
          time_skin_used: time_skin_used,
          players_used_skin: players_used_skin
        }
      });
      await browser.close(); // FERMETURE DU NAVIGATEUR
      data["minecraft_skin_hash"] = skin_data.skin_hash; // AJOUT DE TOUTES LES DONNÉES DANS DATA
      data["minecraft_skin_type"] = skin_data.skin_type;
      data["minecraft_time_skin_used"] = skin_data.time_skin_used;
      data["minecraft_players_used_skin"] = skin_data.players_used_skin;
      return console.log("✔ Skin Récupérer");
    }
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // FONCTION DE RÉCUPÉRATION DES DONNÉES DU PROFILE
    async function getProfileData(uuid) {
      console.log("> Récupération du profile ...");
      let browser = await Puppeteer.launch({ // PAREIL
        headless: true
      });
      let page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
      await page.goto("https://fr.namemc.com/profile/" + uuid);
      let profile_data = await page.evaluate(() => {
        let skin_count = document.querySelector("div.card:nth-child(3) > div:nth-child(1) > strong:nth-child(1) > a:nth-child(1)").innerHTML; // NOMBRE DE SKINS
        let name_count = document.querySelector("div.col-md-6:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > strong:nth-child(1)").innerHTML; // NOMBRE DE PSEUDO
        let skin_url = document.querySelector("div.card:nth-child(3) > div:nth-child(2) > a:nth-child(1)").href; // LIENS DU SKIN ACTUEL
        let views = document.querySelector("div.col-md-6:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2)").innerHTML.split(" /")[0]; // NOMBRE DE VUES PAR MOIS
        let mcname = document.querySelector("h1.text-nowrap").innerHTML.split("<img")[0] // NOM MINECRAFT AVEC LES BONNE MAJ
        if (document.querySelector(".cape-2d")) { // SI UNE CAPE DÉTECTÉ
          if (document.querySelector("div.col-md-6:nth-child(2) > div:nth-child(4) > div:nth-child(1) > strong:nth-child(1) > a:nth-child(1)")) { // SI CAPE OPTIFINE
            var cape = 2
          } else { // SINON C'EST UNE VRAIE CAPE
            var cape = 1 // 1 = VRAI
          }
        } else { // SINON C'EST QU'IL A PAS DE CAPE, TOUT LES HERO N'ONT PAS UNE CAPE LOL
          cape = 0; // 0 = NON
        }
        return { // SAUVEGARDE DES DONNEES
          skin_count: skin_count,
          name_count: name_count,
          skin_url: skin_url,
          views: views,
          name: mcname,
          cape: cape
        }
      });
      await browser.close(); // FERMETURE DU NAVIGATEUR
      data["minecraft_skin_count"] = profile_data.skin_count; // MISE A JOUR DE DATA
      data["minecraft_name_count"] = profile_data.name_count;
      data["name"] = profile_data.name;
      data["minecraft_cape"] = profile_data.cape;
      data["namemc_views"] = profile_data.views;
      console.log("✔ Profile Récupérer");
      return profile_data.skin_url;
    }
    // ----------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------
    // DÉTECTION D'UNE INTERACTION (APPUIS SUR BOUTON)
    bot.on("interaction", int => {
      if (!int.isMessageComponent() && int.componentType !== "BUTTON") return // SI C'EST PAS UN BOUTON, STOP
      if (int.customID !== profile_id && int.customID !== names_id && int.customID !== skin_id && int.customID !== discord_id && int.customID !== up_id && int.customID !== down_id && int.customID !== left_id && int.customID !== right_id && int.customID !== view_id && int.customID !== back_id) return; // SI C'EST UN AUTRE BOUTON, STOP

      enableAllButtons(buttons.components); // ACTIVATION DE TOUT LES BOUTONS
      int.message.removeAttachments();

      if (int.customID == up_id || int.customID == down_id || int.customID == left_id || int.customID == right_id) { // SI BOUTONS DE CONTRÔLE DU SKIN
        switch (int.customID) { // MIS A JOUR DES DONNÉES DE ROTATION DU SKIN SELON LE BOUTONS
          case up_id:
            phi = phi - 30;
            break;
          case down_id:
            phi = phi + 30;
            break;
          case left_id:
            theta = theta - 30;
            break;
          case right_id:
            theta = theta + 30;
            break;
        } // MIS A JOUR DU LIENS AVEC LES NOUVELLES ROTATIONS
        skin_embed.setImage("https://render.namemc.com/skin/3d/body.png?skin=" + data.minecraft_skin_hash + "&model=" + data.minecraft_skin_type + "&theta=" + theta + "&phi=" + phi + "&theta=30&phi=21&time=90&width=400&height=300");
        int.message.edit({ // MODIFICATION DU MESSAGE AVEC LA NOUVELLE IMAGE
          embeds: [skin_embed],
          components: [controls]
        }).then(function() {
          int.deferUpdate();
        }).catch(function(e) {
          errorReply(e);
        })
      }

      if (int.customID == view_id) { // SI BOUTONS POUR CONTRÔLER LE SKIN
        int.message.edit({ // MODIFICATION DU MESSAGE AVEC LES BOUTONS DE ROTATION
          embeds: [skin_embed],
          components: [controls]
        }).then(function() {
          int.deferUpdate();
        }).catch(function(e) {
          errorReply(e);
        })
      }

      if (int.customID == profile_id) { // SI BOUTON DU PROFILE MINECRAFT
        buttons.components[0].setDisabled(true); // DÉSACTIVATION DU BOUTON DU PROFILE MINECRAFT
        int.message.edit({ // MODIFICATION DU MESSAGE AVEC LE BON EMBED
          embeds: [profile_embed],
          components: [buttons]
        }).then(function() {
          int.deferUpdate();
        }).catch(function(e) {
          errorReply(e);
        })
      }

      if (int.customID == skin_id || int.customID == back_id) { // SI BOUTON DU SKIN
        buttons.components[1].setDisabled(true); // DÉSACTIVATION DU BOUTON DU SKIN
        int.message.edit({ // MODIFICATION DU MESSAGE AVEC LE BON EMBED
          embeds: [skin_embed],
          components: [skin_buttons]
        }).then(function() {
          int.deferUpdate();
        }).catch(function(e) {
          errorReply(e);
        })
      }

      if (int.customID == names_id) { // SI BOUTON DES PSEUDOS
        buttons.components[2].setDisabled(true); // DÉSACTIVATION DU BOUTON DES PSEUDOS
        int.message.edit({ // MODIFICATION DU MESSAGE AVEC LE BON EMBED
          embeds: [names_embed],
          components: [buttons],
          files: []
        }).then(function(message) {
          int.deferUpdate();
        }).catch(function(e) {
          errorReply(e);
        })
      }

      if (int.customID == discord_id) { // SI BOUTON DU PROFILE DISCORD
        buttons.components[3].setDisabled(true); // DÉSACTIVATION DU BOUTON DU PROFILE DISCORD
        int.message.edit({ // MODIFICATION DU MESSAGE AVEC LE BON EMBED
          embeds: [discord_embed],
          components: [buttons]
        }).then(function() {
          int.deferUpdate();
        }).catch(function(e) {
          errorReply(e);
        })
      }

      function errorReply(e) { // FONCTION D'ERREUR D'INTERACTION
        console.log(e);
        error_embed.setAuthor("❌ Erreur").setDescription(String(e));
        int.message.edit({
          embeds: [error_embed]
        })
      }

      function enableAllButtons(buttons) { // FONCTION D'ACTIVATION DE TOUT LES BOUTONS
        buttons.forEach((button, i) => { // POUR CHAQUES BOUTONS
          button.setDisabled(false); // ACTIVATION
        });
      }
    })
    // ----------------------------------------------------------------------------------

  },
};
