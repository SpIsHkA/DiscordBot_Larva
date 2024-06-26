const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Начать розыгрыш призов')
    .addSubcommand(command => command.setName('start').setDescription('Начать розыгрыш').addStringOption(option => option.setName('duration').setDescription('Продолжительность розыгрыша (1m, 1d, 1c etc)').setRequired(true)).addIntegerOption(option => option.setName('winners').setDescription('Кол-во победителей').setRequired(true)).addStringOption(option => option.setName('prize').setDescription('Какой выигрыш').setRequired(true)).addChannelOption(option => option.setName('channel').setDescription('В каком канале устроить раздачу').setRequired(true)).addStringOption(option => option.setName('content').setDescription('Дополнительный контент').setRequired(false)))
    .addSubcommand(command => command.setName('edit').setDescription('Отредактировать розыгрыш').addStringOption(option => option.setName('message-id').setDescription('Укажите ID розыгрыша').setRequired(true)).addStringOption(option => option.setName('time').setDescription('на сколько продлить розыгрыш').setRequired(true)).addIntegerOption(option => option.setName('winners').setDescription('Сколько будет победителей').setRequired(true)).addStringOption(option => option.setName('prize').setDescription('Укажите новый приз').setRequired(false)))
    .addSubcommand(command => command.setName('end').setDescription('Завершить раздачу').addStringOption(option => option.setName('message-id').setDescription('Укажите ID розыгрыша').setRequired(true)))
    .addSubcommand(command => command.setName('reroll').setDescription('Перезапустить розыгрыш').addStringOption(option => option.setName('message-id').setDescription('Укажите ID розыгрыша').setRequired(true))),
    async execute (interaction, client) {

        const sub = interaction.options.getSubcommand();

            switch (sub) {
                case 'start':

                await interaction.reply({ content: 'Начата раздача', ephemeral: true })

                const duration = ms(interaction.options.getString('duration') || "");
                const winnerCount = interaction.options.getInteger('winners');
                const prize = interaction.options.getString('prize');
                const contentmain = interaction.options.getString('content');
                const channel = interaction.options.getChannel('channel');
                const showchannel = interaction.options.getChannel('channel') || interaction.channel;
                if (!channel && !contentmain)

                    client.giveawayManager.start(interaction.channel, {
                        prize,
                        winnerCount,
                        duration,
                        gostedBy: interaction.user,
                        lastChance: {
                            enabled: false,
                            content: contentmain,
                            threshold: 60000000000_000,
                            embedColor: '#3D4C8D'
                    }
                })

                else if (!channel)
                client.giveawayManager.start(interaction.channel, {
                    prize,
                    winnerCount,
                    duration,
                    gostedBy: interaction.user,
                    lastChance: {
                        enabled: true,
                        content: contentmain,
                        threshold: 60000000000_000,
                        embedColor: '#3D4C8D'
                    }
                })
                
                else if (!contentmain)
                client.giveawayManager.start(channel, {
                    prize,
                    winnerCount,
                    duration,
                    hostBy: interaction.user,
                    lastChance: {
                        enabled: false,
                        content: contentmain,
                        threshold: 60000000000_000,
                        embedColor: '#3D4C8D'
                    }
                })
                
                else
                client.giveawayManager.start(channel, {
                    prize,
                    winnerCount,
                    duration,
                    hostedBy: interaction.user,
                    lastChance: {
                        enabled: true,
                        content: contentmain,
                        threshold: 60000000000_000,
                        embedColor: '#3D4C8D'
                    }
                });

                interaction.editReply({ content: `Ваш розыгрыш подарков уже начался в ${showchannel}`, ephemeral: true });

                break;
                case 'edit':

                await interaction.reply({ content: 'Изменяем ваш розыгрыш', ephemeral: true });

                const newprize = interaction.options.getString('prize');
                const newduration = interaction.options.getString('time');
                const newwinners = interaction.options.getInteger('winners');
                const messageId = interaction.options.getString('message-id');
                client.giveawayManager.edit(messageId, {
                    addTime: ms(newduration),
                    newWinnerCount: newwinners,
                    newPrize: newprize
                }).then(() => {
                    interaction.editReply({ content: 'Ваш розыгрыш отредактирован', ephemeral: true })
                }).catch(err => {
                    interaction.editReply({ content: 'Произошла ошибка', ephemeral: true })
                });

                break;
                case 'end':

                await interaction.reply({ content: 'Заканчиваем розыгрыш', ephemeral: true });

                const messageId1 = interaction.options.getString('message-id');

                client.giveawayManager.end(messageId1).then(() => {
                    interaction.editReply({ content: 'Розыгрыш закончен', ephemeral: true });
                }).catch(err => {
                    interaction.editReply({ content: 'Произошла ошибка', ephemeral: true })
                })

                break;
                case 'reroll':

                await interaction.reply({content: 'Перезапускаем розыгрыш', ephemeral: true });

                const query = interaction.options.getString('message-id');
                const giveaway = client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === query) || client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === query)

                if (!giveaway) return interaction.editReply({ content: 'Не получается найти данный розыгрыш', ephemeral: true});
                const messageId2 = interaction.options.getString('message-id');
                client.giveawayManager.reroll(messageId2).then(() => {
                    interaction.editReply({ content: 'Ваш розыгрыш был перезапущен', ephemeral: true });
                }).catch(err => {
                    interaction.editReply({ content: 'Произошла ошибка', ephemeral: true });
                })
            }
    }
}
