const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');
const ticketSchema = require('../../Schemas.js/ticketSchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket-disable')
    .setDescription('удаляет билеты'),
    async execute (interaction) {

        ticketSchema.deleteMany({ Guild: interaction.guild.id}, async(err, data) => {
            await interaction.reply({ content: 'Билеты удалены', ephemeral: true})
        })

    }
}