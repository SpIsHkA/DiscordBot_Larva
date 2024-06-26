const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('nav')
    .setDescription('Отправляет навигацию'),
    async execute (interaction) {

            const nav1 = new EmbedBuilder()
            .setImage('https://sun9-7.userapi.com/impg/hBDJ6opzYS9dudoOeiFy1aREJFViUQsKWOoUow/X9vTnXu48zk.jpg?size=1920x1080&quality=95&sign=523d269ae8d86d0033990e6019d8e672&type=album')
            .setColor('#3D4C8D')
    
            const nav2 = new EmbedBuilder()
            .setImage('https://cdn.discordapp.com/attachments/1074253867124019260/1253364095441174671/1.png?ex=667595c6&is=66744446&hm=1892691c277bb5986bff1b29fd80f86437f95f8ccc781ff59a4294cb6aac4bb4&')
            .setAuthor({ name: 'Выбери раздел, нажав на него в меню выбора', iconURL: 'https://cdn.discordapp.com/icons/1096364345002315779/9576317244e54869becb9cae28aff48b.webp?size=96'})
            .setDescription("• **Роли** — информация о ролях сервера. \n • **Команды** — команды серверных ботов. \n • **Игры** — игры Larva Games. \n • **Соц. Сети** — социальные сети Larva. ")
            .setColor('#3D4C8D')

            const rule = new ButtonBuilder()
	        .setLabel('Правила')
	        .setURL('https://discord.com/channels/1096364345002315779/1099626615526400021')
	        .setStyle(ButtonStyle.Link);

            const button = new ActionRowBuilder()
			.addComponents(rule);

            const menu = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                .setCustomId('nav3')
                .setPlaceholder('Выбери свой путь')
                .addOptions(
                    {
                        label: "Роли",
                        emoji: "1100391867855667290",
                        name: "ybayo",
                        value: "role"
                    },
                    {
                        label: "Команды ботов",
                        emoji: "1100391880358891631",
                        name: "ybthink",
                        value: "command"
                    },
                    {
                        label: "Игры",
                        emoji: "1100391869961211904",
                        name: "ybsmoke",
                        value: "game"
                    },
                    {
                        label: "Соц. сети",
                        emoji: "1100391854215790724",
                        name: "ybsunglasses",
                        value: "social"
                    }
                    
                )
        
            )

        await interaction.channel.send({ embeds: [nav1, nav2], components: [menu, button] });
        
        
        
        
    }
}