const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5816147093:AAGzn4XIczlKOT3MD5HYPf0bDNGWUZwET7Q';//http://t.me/tgweb_appbot
const webAppUrl = 'https://admirable-baklava-ba0d35.netlify.app';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text==='/start'){
        // send a message to the chat acknowledging receipt of their message
        await bot.sendMessage(chatId, 'Ниже появиться кнопка, заполни форму',{
            reply_markup:{
                keyboard: [
                    [{text: 'Заполнить форму', web_app:{url: webAppUrl + '/form'}}]
                ],
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app:{url: webAppUrl}}]
                ]
            }
        });
    }

    if(msg?.web_app_data?.data){
        try{
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
            await bot.sendMessage(chatId, 'Ваша страна:' + data?.country);
            await bot.sendMessage(chatId, 'Ваша улица:' + data?.street);

            setTimeout(async () =>{
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            },3000);
        }catch(e){
            console.log(e);
        }
    }

});

app.post('/web-data',async (req,res) => {
    const {queryId,products, totalPrice} = request.body;
    try{
        await bot.answerWebAppQuery(queryId,{
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {message_text: 'Поздравляем с покупкой. Вы приобрели товар на сумму ' + totalPrice}
        });
        return res.status(200).json({});
    }catch(e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось преобрести товар',
            input_message_content: {message_text: 'Не удалось преобрести товар'}
        });
        return res.status(500).json({});
    }
})

const PORT = 8080;
app.listen(PORT, () => console.log(`server start on PORT ${PORT}`));
/*
shopId 506751

shopArticleId 538350

Здесь всё. Теперь возвращайтесь к @BotFather — он пришлет тестовый платежный токен.
Для оплаты используйте данные тестовой карты: 1111 1111 1111 1026, 12/22, CVC 000.

Когда будете готовы принимать настоящие платежи, выберите у @BotFather своего бота,
затем Bot Settings -> Payments -> ЮKassa: платежи.
Вам потребуется настоящий shopId, его выдают после регистрации в ЮKassa: https://yookassa.ru/joinups

ЮKassa Test: 381764678:TEST:55985 2023-05-02 07:47*/