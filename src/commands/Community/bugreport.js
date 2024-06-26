const {
    SlashCommandBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ChatInputCommandInteraction,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("bugreport")
      .setDescription("Репорт багов бота")
      .addStringOption((option) =>
        option
          .setName("severity")
          .setDescription("Выберите уровень серьезности ошибки")
          .addChoices(
            { name: "Low", value: "low" },
            { name: "Medium", value: "medium" },
            { name: "High", value: "high" }
          )
          .setRequired(true)
      ),
  
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
      const severity = interaction.options.getString("severity");
      const reportModal = new ModalBuilder()
        .setCustomId("bugmodal")
        .setTitle("Сообщить о баге");
    
      const titleInput = new TextInputBuilder()
        .setCustomId("bugtitle")
        .setLabel("Title")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("С какой ошибкой вы столкнулись?")
        .setMaxLength(256)
        .setRequired(false);
    
      const descriptionInput = new TextInputBuilder()
        .setCustomId("bugdescription")
        .setLabel("Опишите баг")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);
    
      const titleactionRow = new ActionRowBuilder().addComponents(titleInput);
      const descriptionactionRow = new ActionRowBuilder().addComponents(descriptionInput);
      
    
      reportModal.addComponents(titleactionRow, descriptionactionRow);
    
      try {
        await interaction.showModal(reportModal);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Что-то пошло не так",
          ephemeral: true,
        })
      };
    
        const response = await interaction.awaitModalSubmit({ time: 300000 });
        const title = response.fields.getTextInputValue("bugtitle");
        const description = response.fields.getTextInputValue("bugdescription");
       
        await response.deferUpdate();
        
          let embedColor;
        if (severity === "low") {
          embedColor = "Yellow";
        } else if (severity === "medium") {
          embedColor = "Orange";
        } else {
          embedColor = "Red";
        }
       
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle(`${severity.toUpperCase()} приоритетное сообщение об ошибке`)
          .addFields(
            { name: "Название", value: title },
            { name: "Описание", value: description },
            { name: "От кого:", value: `${interaction.member}` },
          )
          .setTimestamp()
    
        const guildId = "1096364345002315779";
        const channelId = "1099631556005462072";
    
        const guild = await interaction.client.guilds.fetch(guildId);
        const channel = guild.channels.cache.get(channelId);
       
        try {
          await channel.send({ embeds: [embed] });
          await interaction.followUp({ content: "Отчет об ошибке успешно отправлен на сервер поддержки!", ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.followUp({
            content: "Не удалось отправить отчет об ошибке",
            ephemeral: true,
          });
        }
      }
  }