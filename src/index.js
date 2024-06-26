const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, ActivityType, SelectMenuBuilder, ActionRowBuilder, ChannelType, ButtonBuilder, Events, Intents, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle   } = require(`discord.js`);
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates] }); 
const prefix = ';';


client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

const process = require('node:process');

process.on('unhandledRejection', async (reason, promise) => {
  console.log('Необработанный отказ:', promise, 'Причина:', reason);
});

process.on('uncaughtException', (err) => {
  console.log('Перехваченое исключение:', err)
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('Перехваченое исключение монитор', err, origin)
});

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

client.on('ready', async  () => {
    console.log('Бот в сети!');

    client.user.setActivity({
        name: 'Larva Games',
        type: ActivityType.Watching
    });

})




//Отправка упоминаний в определенных каналах

client.on('messageCreate', async (message) => {
    // Упоминание о новых роликах
    if (message.author.id === '1096358669131730944' && message.channel.id === '1112792466928705728') { //от какого человека и в каком канале
      const roleId1 = '1109048071289057320'; // какая роль упоминается
      const role1 = message.guild.roles.cache.get(roleId1);
  
      if (role1) {
        // Упоминаем роль
        message.channel.send(`${role1}`);
  
        // Копируем сообщение пользователя
        const copiedMessage = message.content;
  
        // Разделяем описание и ссылку
        const [description1, videoLink1] = copiedMessage.split('\n\n');
  
        // Создаем и отправляем сообщение в эмбеде с описанием
        const embedDescription1 = new EmbedBuilder()
          .setDescription(description1)
          .setColor('#FF0000'); // Замените на нужный шестнадцатеричный цвет
  
        await message.channel.send({ embeds: [embedDescription1] });
  
        // Создаем и отправляем сообщение в эмбеде с ссылкой
        message.channel.send(`${videoLink1}`);
  
        // Удаляем сообщение пользователя
        message.delete();
      }
    } 
});

// Вопросы с ветками
client.on('messageCreate', async (message) => {

    
    const channelId = '1114883807020056636'; // В каком канале

    if (message.channel.id === channelId && message.author.id !== client.user.id) {
      const copiedMessage = message.content;
      await message.delete();
  
      // Создаем новый MessageEmbed
      const embed = new EmbedBuilder()
        .setColor('#8300D3')
        .setTitle('Новый вопрос')
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .setDescription(`${copiedMessage}\n\n**Отправитель:** ${message.author}`)
  
      // Отправляем эмбед в тот же канал
      const sentEmbed = await message.channel.send({ embeds: [embed] });

      const thread = await sentEmbed.startThread({
        name: '💭／Ответ',
        autoArchiveDuration: 60,
        reason: 'Starting a discussion based on the message',
      });

      embed.fields[0].value = thread.url;
      await sentEmbed.edit({ embeds: [embed] });
      
    }
})

client.on('messageCreate', async (message) => {
  // Указываете ID пользователя и ID чата, в котором хотите добавлять ветку
  const userId = '1096358669131730944';
  const channelId = '1096367851411083295';

  // Проверяем, что сообщение отправлено нужным пользователем в нужном чате
  if (message.author.id === userId && message.channel.id === channelId) {
    // Создаем ветку для сообщения пользователя
    const thread = await message.startThread({
      name: '💭／Обсуждение',
      autoArchiveDuration: 60, // Длительность автоархивации в минутах
    });
  }
});

client.on('messageCreate', async (message) => {
  // Указываете ID пользователя и ID чата, в котором хотите добавлять ветку
  const userId = '1096358669131730944';
  const channelId = '1096367417850089552';

  // Проверяем, что сообщение отправлено нужным пользователем в нужном чате
  if (message.author.id === userId && message.channel.id === channelId) {
    // Создаем ветку для сообщения пользователя
    const thread = await message.startThread({
      name: '💭／Обсуждение',
      autoArchiveDuration: 60, // Длительность автоархивации в минутах
    });
  }
});

client.on('messageCreate', async (message) => {
  // Указываете ID чата, в котором хотите добавлять ветку
  const channelId = '1096369333590048878';

  // Проверяем, что сообщение отправлено в нужном чате
  if (message.channel.id === channelId) {
    // Создаем ветку для сообщения
    const thread = await message.startThread({
      name: '💭／Обсуждение',
      autoArchiveDuration: 60, // Длительность автоархивации в минутах
    });
  }
});


//Подача заявки на ивент
/*
const buttonStates = new Map();

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton()) {
    if (interaction.customId === 'application_button') {
      const userButtonState = buttonStates.get(interaction.user.id);

      if (!userButtonState || userButtonState === 'active') {
        const modal = new ModalBuilder()
          .setTitle('Подача заявки')
          .setCustomId(`complaint_modal-${interaction.user.id}`);

        const username = new TextInputBuilder()
          .setCustomId('username')
          .setLabel('Ник в minecraft')
          .setPlaceholder('')
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const approval = new TextInputBuilder()
          .setCustomId('approval')
          .setLabel('Согласны ли вы с правилами ивента?')
          .setPlaceholder('Да')
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const row_username = new ActionRowBuilder().addComponents(username);
        const row_approval = new ActionRowBuilder().addComponents(approval);

        modal.addComponents(row_username, row_approval);

        try {
          await interaction.showModal(modal);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "Что-то пошло не так",
            ephemeral: true,
          });
        }

        const response = await interaction.awaitModalSubmit({ time: 300000 });
        const usernameInput = response.fields.getTextInputValue("username");
        const approvalInput = response.fields.getTextInputValue("approval");

        await response.deferUpdate();

        const embed = new EmbedBuilder()
          .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
          .setColor('#8300D3')
          .setTitle(`Новая жалоба`)
          .addFields(
            { name: "Ник в minecraft", value: usernameInput },
            { name: "Согласие", value: approvalInput },
            { name: "От кого:", value: `${interaction.member}` },
          )
          .setTimestamp()

        const guildId = "1096364345002315779"; //ID сервера
        const channelId = "1114147057582747679"; //ID канала, куда будут отправляться сообщения о заявках
      
        const guild = await interaction.client.guilds.fetch(guildId);
        const channel = guild.channels.cache.get(channelId);
         
        try {
          await channel.send({ embeds: [embed] });
          await interaction.followUp({ content: "Вы зарегистрировались на ивент.", ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.followUp({
            content: "Не удалось зарегистрироваться.",
            ephemeral: true,
          });
        }

        buttonStates.set(interaction.user.id, 'disabled');
      } else {
        await interaction.reply({
          content: "Вы уже зарегистрированы.",
          ephemeral: true,
        });
      }
    }
  }
});
*/
/*
//Подача жалобы
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'complaint') {
            const modal = new ModalBuilder()
                .setTitle('Подача жалобы')
                .setCustomId(`complaint_modal-${interaction.user.id}`);

            const username_violator = new TextInputBuilder()
                .setCustomId('username_violator')
                .setLabel('Ник нарушителя')
                .setPlaceholder('spichka🖤#6666 или Ruletoedus#2475')
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            const user_reason = new TextInputBuilder()
                .setCustomId('user_reason')
                .setLabel('Причина')
                .setPlaceholder('Оскорбления')
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);

            const row_user_violator = new ActionRowBuilder().addComponents(username_violator);
            const row_user_reason = new ActionRowBuilder().addComponents(user_reason);

            modal.addComponents(row_user_violator, row_user_reason);

            try {
                await interaction.showModal(modal);
              } catch (error) {
                console.error(error);
                await interaction.reply({
                  content: "Что-то пошло не так",
                  ephemeral: true,
                })
              };

            const response = await interaction.awaitModalSubmit({ time: 300000 });
            const username_violatorInput = response.fields.getTextInputValue("username_violator");
            const user_reasonInput = response.fields.getTextInputValue("user_reason");
             
            await response.deferUpdate();

            const embed = new EmbedBuilder()
            .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
            .setColor('#8300D3')
            .setTitle(`Новая жалоба`)
            .addFields(
              { name: "Нарушитель", value: username_violatorInput },
              { name: "Причина", value: user_reasonInput },
              { name: "От кого:", value: `${interaction.member}` },
            )
            .setTimestamp()

            const guildId = "1096364345002315779"; //ID сервера
            const channelId = "1113841924877590570"; //ID канала, куда будут отправляться сообщения о жалобах
        
            const guild = await interaction.client.guilds.fetch(guildId);
            const channel = guild.channels.cache.get(channelId);
           
            try {
              await channel.send({ embeds: [embed] });
              await interaction.followUp({ content: "Спасибо за помощь, мы обязательно во всём разберемся!", ephemeral: true });
            } catch (error) {
              console.error(error);
              await interaction.followUp({
                content: "Не удалось отправить отчет об ошибке",
                ephemeral: true,
              });
            }


        }
    }
    
})*/

const ticketSchema = require('./Schemas.js/ticketSchema')
client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isButton()) return;
  if (interaction.isChatInputCommand()) return;

  const modal = new ModalBuilder()
  .setTitle('Подача жалобы')
  .setCustomId(`modal`);

  const username_violator = new TextInputBuilder()
  .setCustomId('username_violator')
  .setLabel('Ник нарушителя')
  .setPlaceholder('spichka🖤#6666 или Ruletoedus#2475')
  .setRequired(true)
  .setStyle(TextInputStyle.Short);

  const user_reason = new TextInputBuilder()
  .setCustomId('user_reason')
  .setLabel('Причина')
  .setPlaceholder('Оскорбления')
  .setRequired(true)
  .setStyle(TextInputStyle.Paragraph);

  const row_user_violator = new ActionRowBuilder().addComponents(username_violator);
  const row_user_reason = new ActionRowBuilder().addComponents(user_reason);

  modal.addComponents(row_user_violator, row_user_reason);

  let choices;
  if (interaction.isSelectMenu()) {
    if (interaction.customId === 'select') {
      
      choices = interaction.values;

      const result = choices.join('');

      ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

        const filter = {Guild: interaction.guild.id};
        const update = {Ticket: result};

        ticketSchema.updateOne(filter, update, {
          new: true
        }).then(value => {
          console.log(value)
        })
      })
    }
  }

  if (!interaction.isModalSubmit) {
    interaction.showModal(modal)
  }
  

})

client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isModalSubmit()) {

    if (interaction.customId === 'modal') {

      ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

        const username_violatorInput = response.fields.getTextInputValue("username_violator");
        const user_reasonInput = response.fields.getTextInputValue("user_reason");

        const posChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
        if (posChannel) return await interaction.reply({ content: `У вас уже есть открытый билет - ${posChannel} `, ephemeral: true})

        const category = data.Channel;

        const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${interaction.user.username} билет`)
        .setDescription(`Добро пожаловать в ваш билет`)
        .addFields({ name: `Нарушитель`, value: `${username_violatorInput}`})
        .addFields({ name: `Причина`, value: `${user_reasonInput}`})
        .addFields({ name: `Тип`, value: `${data.Ticket}`})
        .setFooter({ text: `${interaction.guild.name}`})

        const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('ticket')
          .setLabel(`Закрыть билет`)
          .setStyle(ButtonStyle.Danger)
        )

        let channel = await interaction.guild.channels.create({
          name: `билет-${interaction.user.id}`,
          type: ChannelType.GuildText,
          parent: `${category}`
        })

        let msg = await channel.send({ embeds: [embed], components: [button]});
        await interaction.reply({ content: `Ваш билет открыт в ${channel}`, ephemeral: true})

        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async i => {
          ;(await channel).delete();

          const dmEmbed = new EmbedBuilder()
          .setColor('Aqua')
          .setTitle(`Ваш билет закрыт`)
          .setDescription(`Спасибо, что связались с нами`)
          .setFooter({ text: `${interaction.guild.name}`}) 
          .setTimestamp()

          await interaction.member.send({ embeds: [dmEmbed]}).catch(err => {
            return;
          })
        })
      })
    }
  }
})

//навигация
client.on(Events.InteractionCreate, async interaction => { 

    //Роли
    const role1 = new EmbedBuilder()
        .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
        .setTitle ("```Staff роли:```")
        .setDescription("<@&1099693900534394900> — роль создателя сервера \n \n<@&1099619378577809488> — главная администрация \n \n<@&1100050812111167518> — ст. модерация\n \n<@&1102131655432486992> — мл. модерация \n \n<@&1102132830131191909> — организатор ивентов")
        .setColor('#3D4C8D')
    
    const role2 = new EmbedBuilder()
        .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
        .setTitle ("```Прочие роли:```")
        .setDescription("<@&1098181448403517451>  —  бустеры сервера \n \n<@&1123236996874248363> — подписчик Boosty \n \n<@&1109048071289057320> — уведомление о новых видео \n \n<@&1109048394447605810> — уведомление об обновлениях игр \n \n<@&1109048976273055754> — уведомление о ивентах \n \n<@&1115616806476972174> — уведомление о трансляциях")
        .setColor('#3D4C8D')

    //Команды
    const comand1 = new EmbedBuilder()
        .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
        .setTitle ("```Команды серверных ботов```")
        .setDescription("**Larva:**\n `/bugreport` - сообщить о багах бота \n\n`/server-info` - информация о сервере \n \n**Larva Economy:**\n `/claimgift` - забрать подарок (каждые 12 часов) \n\n`/promocode` - использовать промокод \n\n`/rob` - украсть монеты у другого пользователя \n\n`/role` - список ваших ролей \n\n`/top` - топ-10 игроков по 🪲 \n\n`/transfer` - перевести монеты (комиссия 5%) \n\n`/wallet` - ваше количество 🪲 \n\n`/shop` - посмотреть доступные товары")
        .setColor('#3D4C8D')

    //Игры
    const game1 = new EmbedBuilder()
        .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
        .setTitle ("```Larva Games:```")
        .setDescription("**The Slime Plague** — [Смотреть в steam](https://store.steampowered.com/app/2359980/The_Slime_Plague/) \n \n** No gravity no sanity** — [Смотреть в steam](https://store.steampowered.com/app/2523780/No_Gravity_No_Sanity/)")
        .setColor('#3D4C8D')

    //Соц. сети
    const social1 = new EmbedBuilder()
        .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
        .setTitle ("```Соц. сети:```")
        .setDescription("<:youtube:1110977941053132800> — [YouTube](https://www.youtube.com/@larva_games) \n \n<:tiktok:1110978483808641094> — [Larva Games](https://www.tiktok.com/@larva_games) \n \n<:tiktok:1110978483808641094> — [Larva Life](https://www.tiktok.com/@larva.life) \n \n<:TwitchGlitchPurple:1118165723949314098> — [Twitch](https://www.twitch.tv/larvagames) \n \n<:telegram:1253354454921646131> — [Telegram](https://t.me/larva_games)")
        .setColor('#3D4C8D') 

    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'nav3') {
        const valor = interaction.values[0];

        if (valor === 'role') {
            await interaction.reply({ embeds: [role1, role2], ephemeral: true });
        } else if (valor === 'command') {
            await interaction.reply({ embeds: [comand1], ephemeral: true });
        } else if (valor === 'game') {
            await interaction.reply({ embeds: [game1], ephemeral: true });
        } else if (valor === 'social') {
            await interaction.reply({ embeds: [social1], ephemeral: true });
        }
    }
})

//наборы
client.on(Events.InteractionCreate, async interaction => { 

  //модер
  const moder1 = new EmbedBuilder()
      .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
      .setTitle ("Набор на должность Хелпера")
      .setDescription("\n\n```Что вас ждет:``` \n **1.** Дружный коллектив \n**2.** Возможность получить ценный опыт и карьерный рост! \n**3.** Возможность попасть в друзья к Larva Games (нет) \n\n```Требования:``` \n• 14+ лет \n• Высокая активность \n• Коммуникативность")
      .setColor('#3D4C8D')

    const moderButton = new ButtonBuilder()
      .setCustomId('moder_recruitment')
      .setLabel('Подать заявку')
      .setStyle(ButtonStyle.Success);

    const button1 = new ActionRowBuilder()
		.addComponents(moderButton);

  //ивентер
  const eventer1 = new EmbedBuilder()
      .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
      .setTitle ("Набор на должность Ивентер")
      .setDescription("\n\n```Что вас ждет:``` \n **1.** Дружный коллектив \n**2.** Возможность получить ценный опыт и карьерный рост! \n**3.** Возможность попасть в друзья к Larva Games (нет) \n\n```Требования:``` \n• 14+ лет \n• Высокая активность \n• Коммуникативность")
      .setColor('#3D4C8D')

    const eventButton = new ButtonBuilder()
      .setCustomId('event_recruitment')
      .setLabel('Подать заявку')
      .setStyle(ButtonStyle.Success);

    const button2 = new ActionRowBuilder()
		  .addComponents(eventButton);


  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === 'nabor3') {
      const valor = interaction.values[0];

      if (valor === 'moder') {
          await interaction.reply({ embeds: [moder1], components: [button1], ephemeral: true });
      } else if (valor === 'eventer') {
          await interaction.reply({ embeds: [eventer1], components: [button2], ephemeral: true });
      }
  }
})

//Набор в ивентеров
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton()) {
      if (interaction.customId === 'event_recruitment') {
          const modal = new ModalBuilder()
              .setTitle('Набор в ивентеров')
              .setCustomId(`complaint_modal-${interaction.user.id}`);

          const device = new TextInputBuilder()
              .setCustomId('device')
              .setLabel('Устройство с которого вы сидите')
              .setPlaceholder('Укажите устройство, с которого вы больше всего проводите время в дискорде')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);

          const time = new TextInputBuilder()
              .setCustomId('time')
              .setLabel('Сколько часов в день')
              .setPlaceholder('Сколько часов вы готовы уделять времени серверу в будние и выходные дни')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);
          
          const why = new TextInputBuilder()
              .setCustomId('why')
              .setLabel('Почему мы должны вас взять')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);

          const experience = new TextInputBuilder()
              .setCustomId('experience')
              .setLabel('Опыт работы')
              .setPlaceholder('Расскажите о вашем опыте работы')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);

          const about_me = new TextInputBuilder()
              .setCustomId('about_me')
              .setLabel('Расскажите немного о себе')
              .setPlaceholder('Меня зовут Вася, мне 14 лет, я люблю мурчать в войсе')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);

          const row_device = new ActionRowBuilder().addComponents(device);
          const row_time = new ActionRowBuilder().addComponents(time);
          const row_why = new ActionRowBuilder().addComponents(why);
          const row_experience = new ActionRowBuilder().addComponents(experience);
          const row_about_me = new ActionRowBuilder().addComponents(about_me);

          modal.addComponents(row_device, row_time, row_why, row_experience, row_about_me);

          try {
              await interaction.showModal(modal);
            } catch (error) {
              console.error(error);
              await interaction.reply({
                content: "Что-то пошло не так",
                ephemeral: true,
              })
            };

          const response = await interaction.awaitModalSubmit({ time: 300000 });
          const deviceInput = response.fields.getTextInputValue("device");
          const timeInput = response.fields.getTextInputValue("time");
          const whyInput = response.fields.getTextInputValue("why");
          const experienceInput = response.fields.getTextInputValue("experience");
          const about_meInput = response.fields.getTextInputValue("about_me");
           
          await response.deferUpdate();

          const embed = new EmbedBuilder()
          .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
          .setColor('#8300D3')
          .setTitle(`Набор на ивентера`)
          .addFields(
            { name: "Устройство с которого вы сидите", value: deviceInput },
            { name: "Сколько часов в день", value: timeInput },
            { name: "Почему мы должны вас взять", value: whyInput },
            { name: "Опыт работы", value: experienceInput },
            { name: "Расскажите немного о себе", value: about_meInput },
            { name: "От кого:", value: `${interaction.member}` },
          )
          .setTimestamp()

          const guildId = "1096364345002315779"; //ID сервера
          const channelId = "1114147057582747679"; //ID канала, куда будут отправляться сообщения о заявках
      
          const guild = await interaction.client.guilds.fetch(guildId);
          const channel = guild.channels.cache.get(channelId);
         
          try {
            await channel.send({ embeds: [embed] });
            await interaction.followUp({ content: "Спасибо, что отправили свою заявку!", ephemeral: true });
          } catch (error) {
            console.error(error);
            await interaction.followUp({
              content: "Не удалось отправить заявку!",
              ephemeral: true,
            });
          }


      }
  }
  
})

//Набор в хелперов
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton()) {
      if (interaction.customId === 'moder_recruitment') {
          const modal = new ModalBuilder()
              .setTitle('Набор в хелперы')
              .setCustomId(`complaint_modal-${interaction.user.id}`);

          const device = new TextInputBuilder()
              .setCustomId('device')
              .setLabel('Устройство с которого вы сидите')
              .setPlaceholder('Укажите устройство, с которого вы больше всего проводите время в дискорде')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);

          const time = new TextInputBuilder()
              .setCustomId('time')
              .setLabel('Сколько часов в день')
              .setPlaceholder('Сколько часов вы готовы уделять времени серверу в будние и выходные дни')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);
          
          const why = new TextInputBuilder()
              .setCustomId('why')
              .setLabel('Почему мы должны вас взять')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);

          const experience = new TextInputBuilder()
              .setCustomId('experience')
              .setLabel('Опыт работы')
              .setPlaceholder('Расскажите о вашем опыте работы')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);

          const about_me = new TextInputBuilder()
              .setCustomId('about_me')
              .setLabel('Расскажите немного о себе')
              .setPlaceholder('Меня зовут Вася, мне 14 лет, я люблю мурчать в войсе')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph);

          const row_device = new ActionRowBuilder().addComponents(device);
          const row_time = new ActionRowBuilder().addComponents(time);
          const row_why = new ActionRowBuilder().addComponents(why);
          const row_experience = new ActionRowBuilder().addComponents(experience);
          const row_about_me = new ActionRowBuilder().addComponents(about_me);

          modal.addComponents(row_device, row_time, row_why, row_experience, row_about_me);

          try {
              await interaction.showModal(modal);
            } catch (error) {
              console.error(error);
              await interaction.reply({
                content: "Что-то пошло не так",
                ephemeral: true,
              })
            };

          const response = await interaction.awaitModalSubmit({ time: 300000 });
          const deviceInput = response.fields.getTextInputValue("device");
          const timeInput = response.fields.getTextInputValue("time");
          const whyInput = response.fields.getTextInputValue("why");
          const experienceInput = response.fields.getTextInputValue("experience");
          const about_meInput = response.fields.getTextInputValue("about_me");
           
          await response.deferUpdate();

          const embed = new EmbedBuilder()
          .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
          .setColor('#3D4C8D')
          .setTitle(`Набор на хелпера`)
          .addFields(
            { name: "Устройство с которого вы сидите", value: deviceInput},
            { name: "Сколько часов в день", value: timeInput },
            { name: "Почему мы должны вас взять", value: whyInput },
            { name: "Опыт работы", value: experienceInput },
            { name: "Расскажите немного о себе", value: about_meInput },
            { name: "От кого:", value: `${interaction.member}` },
          )
          .setTimestamp()

          const guildId = "1096364345002315779"; //ID сервера
          const channelId = "1114147057582747679"; //ID канала, куда будут отправляться сообщения о заявках
      
          const guild = await interaction.client.guilds.fetch(guildId);
          const channel = guild.channels.cache.get(channelId);
         
          try {
            await channel.send({ embeds: [embed] });
            await interaction.followUp({ content: "Спасибо, что отправили свою заявку!", ephemeral: true });
          } catch (error) {
            console.error(error);
            await interaction.followUp({
              content: "Не удалось отправить заявку!",
              ephemeral: true,
            });
          }


      }
  }
  
})

const GiveawaysManager = require('./giveaways');
client.giveawayManager = new GiveawaysManager(client, {
    default: {
      botsCanWin: false,
      embedColor: '#3D4C8D',
      embedColorEnd: '#3D4C8D',
      reaction: '🎉',
    },
});

//Система опросов
const pollschema = require('./Schemas.js/votes');
const internal = require('stream');
client.on(Events.InteractionCreate, async i => {

  if (!i.guild) return;
  if (!i.message) return;
  if (!i.isButton) return;

  const data = await pollschema.findOne({ Guild: i.guild.id, Msg: i.message.id });
  if (!data) return;
  const msg = await i.channel.messages.fetch(data.Msg);

  if (i.customId === 'up') {
    if (data.UpMembers.includes(i.user.id)) return await i.reply({ content: 'Ты не можешь проголосовать еще раз', ephemeral: true });

    let downvotes = data.Downvote;
    if (data.DownMembers.includes(i.user.id)) {
      downvotes = downvotes - 1;
    }

    const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: 'За', value: `**${data.Upvote + 1}** голосов`, inline: true }, { name: 'Против', value: `**${downvotes}** голосов`, inline: true }, { name: 'Автор', value: `<@${data.Owner}>` })

    const buttons = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('up')
          .setLabel('✅')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('down')
          .setLabel('❌')
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId('votes')
          .setLabel('Голоса')
          .setStyle(ButtonStyle.Secondary),
      )

      await i.update({ embeds: [newembed], components: [buttons]});

      data.Upvote++;

      if (data.DownMembers.includes(i.user.id)) {
        data.Downvote = data.Downvote - 1;
      }

      data.UpMembers.push(i.user.id);
      data.DownMembers.pull(i.user.id);
      data.save();

  }

  if (i.customId === 'down') {

    if (data.DownMembers.includes(i.user.id)) return await i.reply({ content: 'Ты не можешь проголосовать еще раз', ephemeral: true });

    let upvotes = data.Upvote;
    if (data.UpMembers.includes(i.user.id)) {
      upvotes = upvotes - 1;
    }

    const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: 'За', value: `**${upvotes}** голосов`, inline: true }, { name: 'Против', value: `**${data.Downvote + 1}** голосов`, inline: true }, { name: 'Автор', value: `<@${data.Owner}>` })

    const buttons = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId('up')
        .setLabel('✅')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId('down')
        .setLabel('❌')
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId('votes')
        .setLabel('Голоса')
        .setStyle(ButtonStyle.Secondary),
    )

    await i.update({ embeds: [newembed], components: [buttons]});

    data.Downvote++;

    if (data.UpMembers.includes(i.user.id)) {
      dataUpvote = data.Upvote - 1;
    }

    data.DownMembers.push(i.user.id);
    data.UpMembers.pull(i.user.id);
    data.save();
  }

  if(i.customId === 'votes') {

    let upvoters = [];
    await data.UpMembers.forEach(async member => {
      upvoters.push(`<@${member}>`)
    });

    let downvoters = [];
    await data.DownMembers.forEach(async member => {
      downvoters.push(`<@${member}>`)
    });

    const embed = new EmbedBuilder()
    .setColor('#8300D3')
    .setAuthor({ name: 'Система опросов'})
    .setFooter({ text: 'Участники опросы'})
    .setTimestamp()
    .setTitle(`Голоса`)
    .addFields({ name: `За ${upvoters.length}`, value: `${upvoters.join(', ').slice(0, 1020) || `Нет проголосовавших`}` , inline: true})
    .addFields({ name: `Против ${downvoters.length}`, value: `${downvoters.join(', ').slice(0, 1020) || `Нет проголосовавших`}`, inline: true})

    await i.reply({ embeds: [embed], ephemeral: true})
  }
})