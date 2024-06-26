const { Wordle } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Угадай слово'),
    async execute (interaction) {

        const Game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Wordle',
                color: '#3D4C8D'
            },
            customWord: null,
            timeoutTime: 60000,
            winMessage: 'Поздравляю тебя, ты победил!',
            loseMessage: 'Ты проиграл! Загаданное слово **{word}**',
            playerOnlyMessage: 'Только {player} может это использовать'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;
        })
    }
}