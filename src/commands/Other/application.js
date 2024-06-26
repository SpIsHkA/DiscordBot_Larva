const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Application } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('application')
    .setDescription('Отправляет заявку на ивент'),
    async execute (interaction) {
    
            const application = new EmbedBuilder()
            .setDescription("Подача заявки")
            .setColor('#3D4C8D')

            const modalButton = new ButtonBuilder()
            .setCustomId('application_button')
            .setLabel('Подать заявку')
            .setStyle(ButtonStyle.Success);

            const button = new ActionRowBuilder()
			.addComponents(modalButton);



        await interaction.channel.send({ embeds: [application], components: [button] });


        
    }
}