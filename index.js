const Discord = require("discord.js"); // Использование этой библиотеки 

const CMD = "&";   // Префикс всех команд 

const TOKEN = "NTE5MDg1Mzc3NzYwNTI2MzM2.DuaLmw.6OQB7iqWUjbAvz4MoV8lsaeoXCM"; // С этим кодом бот подключается к серверу 

const YTDL = require("ytdl-core"); // Использование этой библиотеки

function play(connection, message) { // Функция "play"
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"})); // Бот с помощью этого расширения скачивает звук с видео на ютубе 

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message); // Если есть очередь, то запускается песня
        //else connection.disconnect(); // Если песни закончились, то бот отключистя 
    });
}
var random = [ // Рандомные фразочки, с помощью которых бот будет отвечать на ваши вопросы
    "Да",
    "Нет",
    "Возможно",
    "Не знаю",
    "Ты лох",
    "Жди повестку",
    "Ну прожить можно и без высшего образовния",
    "Будешь бомжом",
    "Даже не пытайся, все равно ничего не выйдет"
]
var bot = new Discord.Client(); // Правильное обозначение бота 

var servers = {};

bot.on("ready", function() { // Когда бот подключается к серверу, на консоль выводится "Ready"
    console.log("Ready");
});

bot.on("message", function(message) { // Если бот включен и получает сообщение
    if (message.content == "hello") { // Если видит сообщение "Hello"
    message.channel.sendMessage("ПрифФфФфФФ"); // Печатает это
    
    if (message.author.equals(bot.user)) return; // Если сообщение от бота - то не надо ничего делать 

    } else if (!message.content.startsWith(CMD)) return;
    
    var args = message.content.substring(CMD.length).split(" "); // Объявляем переменную, которая будет отвечать за команду 

    switch (args[0].toLowerCase()) { // Смотрим какая команда и если буква в команде будет заглавной, то она тоже зачтется как команда 
        case "ping": // Если видит "ping"
            message.channel.sendMessage("Твой пинг - 834"); // Выводи это 
            break;
        case "info":
            message.channel.sendMessage("Я лучший бот, созданный Максимом для реферата по информатике");
            break;
        case "random":
            if (args[1]) message.channel.sendMessage(random[Math.floor(Math.random() * random.length)]); // Формула, по кторой бот выводит случайные фразы, которые написаны в начале
            else message.channel.sendMessage("Не могу это понять");
            break;
        case "play":
            if (!args[1]) { // Если после & ничего нет, то
                message.channel.sendMessage("Введите ссылку"); // Выводит это на экран
                return;
            }

            if (!message.member.voiceChannel) { // Если никого нет в голосовом канале
                message.channel.sendMessage("Кто-то должен находиться в голосовом канале");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {       // Эти команды отвечают за очередь из песен
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) { // Бот подключается к голосовому каналу
                play(connection, message); // Запускает функцию "play"
            
            });
            break;
        case "skip": 
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end(); // Заканчивает песню
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect(); // Отключается от голосового чата
            break;
        default: // Если получает другие команды 
            message.channel.sendMessage("Такой команды пока нет, но скоро мой создатель ее добавит");
    }
});

bot.login(TOKEN); // Бот подключается по этому коду 