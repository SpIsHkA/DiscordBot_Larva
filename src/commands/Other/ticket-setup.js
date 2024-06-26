const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');
const ticketSchema = require('../../Schemas.js/ticketSchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Отправляет билеты')
    .addChannelOption(option => option.setName('channel').setDescription('Куда отправить').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addChannelOption(option => option.setName('category').setDescription('Куда отправлять билеты').addChannelTypes(ChannelType.GuildCategory).setRequired(true)),
    async execute (interaction) {

        const channel = interaction.options.getChannel('channel')
        const category = interaction.options.getChannel('category')

        ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

            if(!data) {
                ticketSchema.create({
                    Guild: interaction.guild.id,
                    Channel: category.id,
                    Ticket: 'first'
                })
            } else {
                await interaction.reply({ content: 'Уже существуют билеты', ephemeral: true})
                return;
            }

            const embed = new EmbedBuilder()
        .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
        .setTitle ("Подача жалобы")
        .setDescription("На кого вы хотите подать жалобу")
        .setColor('#8300D3')

            const menu = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Выбери тему')
                .addOptions(
                    {
                        label: "Пользователь",
                        value: "pol"
                    },
                    {
                        label: "Персонал",
                        value: "personal"
                    },
                    {
                        label: "Другое",
                        value: "other"
                    }
                    
                )
        
            )

            await channel.send({ embeds: [embed], components: [menu]})
            await interaction.reply({ content: `Билеты созданы в канале ${channel}`, ephemeral: true})

        })

        

    }
}