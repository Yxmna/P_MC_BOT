// ----------------------------------------------------------------------------------
//VARIABLES
const Discord = require('discord.js'); //DISCORD
const {
  MessageActionRow,
  MessageButton
} = require('discord.js');
const bot = new Discord.Client({ // CREATION DU BOT
  intents: ['GUILDS', 'GUILD_MESSAGES', "GUILD_PRESENCES"]
});
bot.commands = new Discord.Collection(); // CREATION DE LA LISTES POUR LES FUTURE COMMANDES
const fs = require('fs'); // FS SERT POUR MANUPILER LES FICHIERS
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // RECUPERATION DE TOUTES LES COMMANDES DANS LES DOSSIERS COMMANDS
const token = require('../assets/key.json'); // RECUPERATION DU MDP DU BOTS STOCKER DANS LE FICHIER KEY.JSON QUE TU AURA PAS LOL
const config = require('../assets/config.json'); // RECUPERATION DES CONFIGURATIONS
const functions = require("./functions.js"); // RECUPERATION DES FONCTIONS
const Axios = require('axios'); // Axios SERT LES DEMANDES D'API PLUS SIMPLE

var survie_offline = 0;
var creatif_offline = 0;
var minijeux_offline = 0;
var pepiniere_offline = 0;

var servers_status = {
  vanilla: 0,
  creatif: 0,
  minijeux: 0,
  snapshot: 0
}


setInterval(async function() {

  let survie_request = await Axios.get("https://api.mcsrvstat.us/2/vanilla.play-mc.fr");
  let survie_data = survie_request.data;
  if (survie_data.online) {
    if (survie_offline == 2) {
      bot.channels.cache.find(channel => channel.id = config.channel_staff).send("Serveur survie de nouveau online!");
    }
    console.log("✔ Serveur survie online");
    survie_offline = 0;
  } else {
    console.log("❌ Serveur survie OFFLINE");
    if (survie_offline == 1) {
      bot.channels.cache.find(channel => channel.id = config.channel_staff).send("Serveur survie offline!");
      survie_offline = 2;
    } else if (survie_offline == 0) {
      survie_offline = 1;
    }
  }

  let creatif_request = await Axios.get("https://api.mcsrvstat.us/2/crea.play-mc.fr");
  let creatif_data = creatif_request.data;
  if (creatif_data.online) {
    if (creatif_offline == 2) {
      bot.channels.cache.find(channel => channel.id = config.channel_staff).send("Serveur creatif de nouveau online!");
    }
    console.log("✔ Serveur creatif online");
    creatif_offline = 0;
  } else {
    console.log("❌ Serveur creatif OFFLINE");
    if (creatif_offline == 1) {
      bot.channels.cache.find(channel => channel.id = config.channel_staff).send("Serveur creatif offline!");
      creatif_offline = 2;
    } else if (creatif_offline == 0) {
      creatif_offline = 1;
    }
  }

}, config.check_interval);

// ----------------------------------------------------------------------------------
// ENREGISTREMENT DES COMMANDES DANS LE BOT
for (const file of commandFiles) {
  const command = require("./commands/" + file);
  bot.commands.set(command.name, command);
}

// ----------------------------------------------------------------------------------
// COMMANDE RECU
bot.on('interaction', interaction => {
  if (!interaction.isCommand()) return;
  if (interaction.channel.id != config.channel_command) return;
  props = { // ENREGISTREMENT DES VARIABLES QU'ON AURA BESOIN DANS NOS COMMANDES DANS UN OBJET CAR PLUS FACILE
    interaction: interaction,
    discord: Discord,
    bot: bot,
    buttons: MessageButton,
    actionrow: MessageActionRow,
    config: config,
    functions: functions
  }
  bot.commands.get(interaction.commandName).execute(props); // LANCEMENT DE LA COMMANDE EN QUESTION
});

// ----------------------------------------------------------------------------------
// BOT PRET
bot.on("ready", async () => {
  console.log("----------------------------------------");
  console.log("JE SUIS PRETE WHOWHOO");
  console.log("----------------------------------------");
  console.log();


  bot.guilds.cache.get("574238344121417729").commands.set([]).then(function() {

    // ENREGISTREMENT DES 'SLASH COMMANDS' (LA JOLIE INTERFACE LORSQUE L'ONT FAIS '/')
    bot.commands.each((command) => { // POUR CHAQUE COMMANDES
      var cmd = {
        name: command.name,
        description: command.description,
        options: command.options
      }
      bot.guilds.cache.get("574238344121417729").commands.create(cmd).then().catch(function(err) { // ENREGISTREMENT DES SLASHS COMMANDES DANS LE DISCORD
        console.log(err);
      })
      bot.application.commands.create(cmd).then().catch(function(err) {
        console.log(err);
      })
    })
  })
})

// ----------------------------------------------------------------------------------
// CONNEXION DU BOT AVEC LE MDP
bot.login(token.key);
