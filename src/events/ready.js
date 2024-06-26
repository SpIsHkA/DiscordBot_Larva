const mongoose = require('mongoose')
const mongodbURL = process.env.MONGODBURL;

// Установка опции strictQuery перед подключением к MongoDB
mongoose.set('strictQuery', true);

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Готово!');

        if (!mongodbURL) return;

        await mongoose.connect(mongodbURL || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        if (mongoose.connect) {
            console.log('База данных работает')
        } else {
            console.log('Ошибка подключения к БД')
        }

        async function pickPresence () {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,

                        },
                    
                    ],

                    status: statusArray[option].status
                })
            } catch (error) {
                console.error(error);
            }
        }
    },
};