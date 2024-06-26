const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('Показывает информацию о сервере'),
    async execute (interaction) {

        const { guild } = interaction;
        const { members } = guild;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL();
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;

        let baseVerification = guild.verificationLevel;

        if(baseVerification == 0) baseVerification = 'None'
        if(baseVerification == 1) baseVerification = 'Low'
        if(baseVerification == 2) baseVerification = 'Medium'
        if(baseVerification == 3) baseVerification = 'High'
        if(baseVerification == 4) baseVerification = 'Very High'

        const embed = new EmbedBuilder()
        .setThumbnail(icon)
        .setAuthor({ name: name, iconURL: icon})
        .setFooter({ text: `ID сервера ${id}`})
        .setTimestamp()
        .addFields({ name: "Имя", value: `${name}`, inline: false })
        .addFields({ name: "Дата создания", value: `<t:${parseInt(createdTimestamp / 1000)}:R>`, inline: true })
        .addFields({ name: "Глава сервера", value: `<@${ownerId}>`, inline: true })
        .addFields({ name: "Кол-во участников", value: `${memberCount}`, inline: true })
        .addFields({ name: "Кол-во ролей", value: `${roles}`, inline: true })
        .addFields({ name: "Кол-во emoji", value: `${emojis}`, inline: true })
        .addFields({ name: "Уровень верификации", value: `${baseVerification}`, inline: true })
        .addFields({ name: "Кол-во бустов сервера", value: `${guild.premiumSubscriptionCount}`, inline: true })
        
        await interaction.reply({ embeds: [embed] })

    }
}