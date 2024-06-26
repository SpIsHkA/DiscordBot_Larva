const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, PermissionsBitField } = require('discord.js')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll2')
    .setDescription('Опрос с вариантами ответа')
    .addStringOption(o => o.setName('question').setDescription('Введите вопрос').setRequired(true))
    .addStringOption(o => o.setName('answer-1').setDescription('Вариант 1').setRequired(true))
    .addStringOption(o => o.setName('answer-2').setDescription('Вариант 2').setRequired(true))
    .addStringOption(o => o.setName('answer-3').setDescription('Вариант 3').setRequired(false))
    .addStringOption(o => o.setName('answer-4').setDescription('Вариант 4').setRequired(false))
    .addStringOption(o => o.setName('answer-5').setDescription('Вариант 5').setRequired(false))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const { options } = interaction
        const question = options.getString('question')
        const o1 = options.getString('answer-1')
        const o2 = options.getString('answer-2')
        const o3 = options.getString('answer-3') || undefined
        const o4 = options.getString('answer-4') || undefined
        const o5 = options.getString('answer-5') || undefined
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.editReply('У вас нет разрешения на это.')
        if (!o3 && (o4 != undefined || o5 != undefined)) return await interaction.editReply("Нельзя не указать вариант 3, но указать вариант 4 и/или 5")
        if (o4 != undefined && !o3) return await interaction.editReply('При указании опции 4 необходимо указать опцию 3!')
        if (o5 != undefined && (o4 == undefined || o3 == undefined)) return await interaction.editReply('При указании опции 5 необходимо указать все остальные опции!')
 
        const embed2 = new EmbedBuilder()
        .setTitle(`Новый опрос: ${question}`)
        .setDescription(`*Голосуй реакциями*`) 
        .setColor('#3D4C8D')
        .addFields({ name: `${o1}`, value: 'Проголосуйте за :one:!'})
        .addFields({ name: `${o2}`, value: 'Проголосуйте за :two:!'})
 
        const embed3 = new EmbedBuilder()
        .setTitle(`Новые опрос: ${question}`)
        .setDescription(`*Голосуй реакциями*`)
        .setColor('#3D4C8D')
        .addFields({ name: `${o1}`, value: 'Проголосуйте за :one:!'})
        .addFields({ name: `${o2}`, value: 'Проголосуйте за :two:!'})
        .addFields({ name: `${o3}`, value: 'Проголосуйте за :three:!'})
 
        const embed4 = new EmbedBuilder()
        .setTitle(`Новые опрос: ${question}`)
        .setDescription(`*Голосуй реакциями*`)
        .setColor('#3D4C8D')
        .addFields({ name: `${o1}`, value: 'Проголосуйте за :one:!'})
        .addFields({ name: `${o2}`, value: 'Проголосуйте за :two:!'})
        .addFields({ name: `${o3}`, value: 'Проголосуйте за :three:!'})
        .addFields({ name: `${o4}`, value: 'Проголосуйте за :four:!'})
        
        const embed5 = new EmbedBuilder()
        .setTitle(`Новые опрос: ${question}`)
        .setDescription(`*Голосуй реакциями*`)
        .setColor('#3D4C8D')
        .addFields({ name: `${o1}`, value: 'Проголосуйте за :one:!'})
        .addFields({ name: `${o2}`, value: 'Проголосуйте за :two:!'})
        .addFields({ name: `${o3}`, value: 'Проголосуйте за :three:!'})
        .addFields({ name: `${o4}`, value: 'Проголосуйте за :four:!'})
        .addFields({ name: `${o5}`, value: 'Проголосуйте за :five:!'})
 
 
        let embedNum = null
 
        if (o5 != undefined) {
            embedNum = 5
        } else {
            if (o4 != undefined) {
                embedNum = 4
            } else {
                if (o3 != undefined) {
                    embedNum = 3
                } else embedNum = 2
            }
        }
        let message = undefined
        if (embedNum == 2)  {
            message = await interaction.channel.send({ embeds: [embed2] })
            message.react('1️⃣')
            message.react('2️⃣')
            interaction.editReply("Сделано!")
        }
        
        if (embedNum == 3)  {
            message = await interaction.channel.send({ embeds: [embed3]})
            message.react('1️⃣')
            message.react('2️⃣')
            message.react('3️⃣')
            interaction.editReply("Сделано!")
        }
        
        if (embedNum == 4)  {
            message = await interaction.channel.send({ embeds: [embed4]})
            message.react('1️⃣')
            message.react('2️⃣')
            message.react('3️⃣')
            message.react('4️⃣')
            interaction.editReply("Сделано!")
        }
 
        
        if (embedNum == 5)  {
            message = await interaction.channel.send({ embeds: [embed5]})
            message.react('1️⃣')
            message.react('2️⃣')
            message.react('3️⃣')
            message.react('4️⃣')
            message.react('5️⃣')
            interaction.editReply("Сделано!")
        }
 
    }
}