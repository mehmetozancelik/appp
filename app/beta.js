
const Discord = require('discord.js');
const client = new Discord.Client();
const Activites = new Map();
const Settings = require('./src/Settings/Config.json');
const Main = require('./src/Settings/Settings.json');
const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');
const db = require('quick.db');


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Set();

client.on('ready', async () => {
  client.user.setActivity(`${Main.Status}`, { status: "online"} ,{ type: 'PLAYİNG'})
  .then(console.log(`${client.user.tag} İsmiyle Discord Bağlantısı kuruldu.`))
  .catch(() => console.log(`Bir hata ile karşılaştım.`))
});

fs.readdir('./src/Command/', (err, files) => { 
    files.forEach(fs => { 
    let command = require(`./src/Command/${fs}`); 
    client.commands.set(command.config.name, command);
    if(command.config.aliases) command.config.aliases.forEach(Aliases => client.aliases.set(Aliases, command.config.name));
    });
  });

client.on('message', async message => {
  if (!message.guild || message.author.bot || message.channel.type === 'dm') return;
  let prefix = Main.Prefix.filter(p => message.content.startsWith(p))[0]; 
  if (!prefix) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(prefix.length); 
  let load = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  
  if (load){
   if (!message.member.hasPermission(8) && client.cooldown.has(message.author.id)) return;
    client.cooldown.add(message.author.id);
    setTimeout(() => client.cooldown.delete(message.author.id), 5);
    load.beta(client, message, args);
  };
});
  
//--------------------------------------------HOŞGELDİN-MESAJI---------------------------------------------\\
client.on("guildMemberAdd", async member => {  
  let user = client.users.cache.get(member.id);
  require("moment-duration-format");
      const kurulus = new Date().getTime() - user.createdAt.getTime();  
      var üyesayısı = member.guild.members.cache.size.toString().replace(/ /g, "    ")
    var üs = üyesayısı.match(/([0-9])/g)
    üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()

  var kontrol;
  if (kurulus < 1296000000) kontrol = `Hesap Durumu: <a:odin79:880089010767286272>`
  if (kurulus > 1296000000) kontrol = `Hesap Durumu: <a:odin23:880089011656486912> `
  moment.locale("tr");
  const kanal = member.guild.channels.cache.get(Settings.Welcome.WelcomeChat)
  const kuruluss = new Date().getTime() - user.createdAt.getTime();  
  const gecen = moment.duration(kuruluss).format(`YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`) 
  const embed = new Discord.MessageEmbed()
  .setTitle(`Sunucumuza Hoşgeldin ${member.user.username}`)
  .setThumbnail(member.user.avatarURL({ dynamic: true }))
  .setDescription(` <a:odin5:880089001103618089> Sunucumuza Hoşeldin ${user} !
  
  <a:odin14:880089006979842048> Seninle Beraber Sunucumuzda `+ üyesayısı +` Değerli İnsan Oldu.
  
  <a:odin24:880089035673043005> Hesabın \``+ gecen +`\` Önce Oluşturulmuş.
  
 • `+ kontrol +`
  
 <a:odin86:880089024029663243> <@&${Settings.Roles.Registerer}> Rolündeki Yetkililer Seninle İlgilenicektir.
  
 <a:odin31:880089093969686568> Soldaki \`Confirmation\` Odalarından Birine Geçerek Kaydolabilirsin.
  
 <a:odin85:880089068589940736> Tagımızı Alarak \`${Settings.ServerSettings.Tag}\` Ailemizin Bir Parçası Olabilirsin.`)
  .setColor("RANDOM")
  member.roles.add(Settings.Roles.Unregister)
  member.setNickname(Settings.Welcome.WelcomeName)
  kanal.send(`${user} | <@&${Settings.Roles.Registerer}>`);
  kanal.send(embed);
//--------------------------------------------HOŞGELDİN-MESAJI---------------------------------------------\\
//------------------------------------------ŞÜPHELİ-HESAP-KONTROL-------------------------------------------\\
client.on("guildMemberAdd", member => {
    var moment = require("moment")
    require("moment-duration-format")
    moment.locale("tr")
    var {Permissions} = require('discord.js');
    var x = moment(member.user.createdAt).add(7, 'days').fromNow()
    var user = member.user
     x = x.replace("birkaç saniye önce", " ")
     if(!x.includes("önce") || x.includes("sonra") ||x == " ") {
    const kytsz = Settings.Roles.Unregister
    var rol = member.guild.roles.cache.get(Settings.Roles.Suspicious) 
  member.roles.add(rol)
  member.roles.remove(kytsz)

  member.user.send('Selam Dostum Ne Yazık ki Sana Kötü Bir Haberim Var Hesabın 1 Hafta Gibi Kısa Bir Sürede Açıldığı İçin Fake Hesap Katagorisine Giriyorsun Lütfen Bir Yetkiliyle İletişime Geç Onlar Sana Yardımcı Olucaktır.')
  setTimeout(() => {
  
  }, 1000)
  
  
     }
          else {
  
          }
      });
//------------------------------------------ŞÜPHELİ-HESAP-KONTROL-------------------------------------------\\
//-------------------------------------------------TAG-ROL---------------------------------------------------\\     
    
client.on("userUpdate", async (losxstg, yeni) => {
  var sunucu = client.guilds.cache.get(Settings.ServerSettings.ServerID); 
  var uye = sunucu.members.cache.get(yeni.id);
  var tag = (Settings.ServerSettings.Tag); 
  var tagrol = (Settings.Roles.TagRole); 
  var logKanali = (Settings.Channels.TagLog); 

  if (!sunucu.members.cache.has(yeni.id) || yeni.bot || losxstg.username === yeni.username) return;
  
  if ((yeni.username).includes(tag) && !uye.roles.cache.has(tagrol)) {
    try {
      await uye.roles.add(tagrol);
      await uye.send(`Tagımızı aldığın için teşekkürler! Aramıza hoş geldin.`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor(Settings.Colors.Green).setDescription(`${yeni} adlı üye tagımızı alarak aramıza katıldı!`));
    } catch (err) { console.error(err) };
  };
  
  if (!(yeni.username).includes(tag) && uye.roles.cache.has(tagrol)) {
    try {
      await uye.roles.remove(uye.roles.cache.filter(rol => rol.position >= sunucu.roles.cache.get(tagrol).position));
      await uye.send(`Tagımızı bıraktığın için ekip rolü ve yetkili rollerin alındı! Tagımızı tekrar alıp aramıza katılmak istersen;\nTagımız: **${tag}**`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor(Settings.Colors.Red).setDescription(`${yeni} adlı üye tagımızı bırakarak aramızdan ayrıldı!`));
    } catch(err) { console.error(err) };
  };
});
//-------------------------------------------------TAG-ROL---------------------------------------------------\\   
//------------------------------------------------TAG-KONTROL--------------------------------------------------\\    
    
  client.on("guildMemberAdd", member => {
    let sunucuid = (Settings.ServerSettings.ServerID); 
    let tag = (Settings.ServerSettings.Tag);
    let rol = (Settings.Roles.TagRole); 
  if(member.user.username.includes(tag)){
  member.roles.add(rol)
    const tagalma = new Discord.MessageEmbed()
        .setColor(Settings.Colors.Green)
        .setDescription(`<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı, o doğuştan beri bizden !`)
        .setTimestamp()
       client.channels.cache.get(Settings.Channels.TagLog).send(tagalma)
  }
  })
});
//------------------------------------------------TAG-KONTROL--------------------------------------------------\\  

client.login(process.env.token);