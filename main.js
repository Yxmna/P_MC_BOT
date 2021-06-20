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
const token = require('./key.json'); // RECUPERATION DU MDP DU BOTS STOCKER DANS LE FICHIER KEY.JSON QUE TU AURA PAS LOL
const config = require('./config.json'); // RECUPERATION DES CONFIGURATIONS
const functions = require("./functions.js"); // RECUPERATION DES FONCTIONS

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
console.log("JE SUIS PRETE MIAM");
console.log("----------------------------------------");
console.log();

  // bot.guilds.cache.get("574238344121417729").commands.set([]);
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
  })
})

// ----------------------------------------------------------------------------------
// CONNEXION DU BOT AVEC LE MDP
bot.login(token.key);
