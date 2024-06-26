const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js')
const pollschema = require('../../Schemas.js/votes')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Провести опрос')
    .addStringOption(option => option.setName('topic').setDescription('Тема опроса').setMinLength(1).setMaxLength(2000).setRequired(true)),
    async execute (interaction) {

        await interaction.reply({ content: 'Ваш опрос начат ниже', ephemeral: true })
        const topic = await interaction.options.getString('topic')

        const embed = new EmbedBuilder()
        .setColor('#3D4C8D')
        .setAuthor({ name: 'Система опросов'})
        .setFooter({ text: 'Опрос начат'})
        .setTimestamp()
        .setTitle(`🎉 Опрос начался`)
        .setDescription(`${topic}`)
        .addFields({ name: 'За', value: '**Нет голосов**', inline: true})
        .addFields({ name: 'Против', value: '**Нет голосов**', inline: true})
        .addFields({ name: 'Автор', value: `${interaction.user}`, inline: false})

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

        const msg = await interaction.channel.send({ embeds: [embed], components: [buttons]});
        msg.createMessageComponentCollector();

        await pollschema.create({
            Msg: msg.id,
            Upvote: 0,
            Downvote: 0,
            UpMembers: [],
            DownMembers: [],
            Guild: interaction.guild.id,
            Owner: interaction.user.id
        })

    }
}