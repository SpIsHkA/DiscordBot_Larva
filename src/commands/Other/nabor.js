const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('job')
    .setDescription('Отправляет набор на должности'),
    async execute (interaction) {

            const nabor1 = new EmbedBuilder()
            .setImage('https://media.discordapp.net/attachments/1099668302554472551/1129120585562206259/Slide_16_9_-_9.gif')
            .setColor('#3D4C8D')
    
            const nabor2 = new EmbedBuilder()
            .setImage('https://cdn.discordapp.com/attachments/1099668302554472551/1112422572483690558/1.png')
            .setTitle('Набор в **Staff**')
            .setDescription("• **Хотите попасть в наш дружный коллектив?** \n\n Рассмотрите должности на нашем сервере и выберите ту, которая вам больше всего подходит")
            .setColor('#3D4C8D')

            const menu = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                .setCustomId('nabor3')
                .setPlaceholder('Выбрать должность')
                .addOptions(
                    {
                        label: "Хелпер",
                        emoji: "1122473728249434173",
                        name: "odnoklassnikisunglasses",
                        value: "moder"
                    },
                    {
                        label: "Ивентер",
                        emoji: "1122473725355360306",
                        name: "odnoklassnikitongue",
                        value: "eventer"
                    },

                    
                )
        
            )

        await interaction.channel.send({ embeds: [nabor1, nabor2], components: [menu] });
        
        
        
        
    }
}