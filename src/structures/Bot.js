const { Client, Collection, Intents } = require('discord.js');
const Utils = require('./Utils');
const logger = require('../main/logger');
const fs = require('fs');
const mongoose = require('mongoose');

module.exports = class Bot extends Client {
    constructor(options = {}) {
        super({
            allowedMentions: { parse: ['users', 'roles'] },
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES,
            ],
        });

        this.commands = new Collection();
        this.aliases = new Collection();

        this.slashCommands = new Collection();

        this.subscriptions = new Map();

        this.events = new Collection();

        this.utils = new Utils(this);

        this.config = options;
        this.logger = logger;
    }

    isUnixHiddenPath = function (path) {
        return /(^|\/)\.[^\/\.]/g.test(path);
    };

    loadCommands() {
        const cmdDirs = fs
            .readdirSync('./src/commands')
            .filter(dir => !this.isUnixHiddenPath(dir));

        for (const dir of cmdDirs) {
            const cmdFiles = fs
                .readdirSync(`./src/commands/${dir}`)
                .filter(file => file.endsWith('.js'));

            for (const file of cmdFiles) {
                const Command = require(`../commands/${dir}/${file}`);
                const command = new Command(this);

                this.commands.set(command.name, command);
                for (const alias of command.aliases) {
                    this.aliases.set(alias, command.name);
                }
            }
        }
        this.logger.load(
            `Loaded ${this.commands.size} command${
                this.commands.size === 1 ? '' : 's'
            }`
        );
    }

    async loadInteractions(dev = true, id = this.config.devGuildID) {
        const interactionDirs = fs
            .readdirSync('./src/slashCommands')
            .filter(dir => !this.isUnixHiddenPath(dir));

        for (const dir of interactionDirs) {
            const interactionFiles = fs
                .readdirSync(`./src/slashCommands/${dir}`)
                .filter(file => file.endsWith('.js'));

            for (const file of interactionFiles) {
                const SlashCommand = require(`../slashCommands/${dir}/${file}`);
                const slashCommand = new SlashCommand(this);

                this.slashCommands.set(slashCommand.name, slashCommand);

                // await this.guilds.cache
                //     .get(id)
                //     ?.commands.create(slashCommand.options);
            }
        }

        const slashCommands = [];
        this.slashCommands.map(slashCommand => {
            slashCommands.push(slashCommand.options);
        });

        try {
            if (dev) {
                // Register guild commands

                await this.guilds.cache.get(id).commands.set(slashCommands);
            } else {
                // Register global commands

                await this.application.commands.set(slashCommands);
            }
        } catch (err) {
            this.logger.error(`Error while setting slash commands: ${err}`);
        }

        this.logger.load(
            `Loaded ${this.slashCommands.size} interaction${
                this.slashCommands.size === 1 ? '' : 's'
            }`
        );
    }

    loadEvents() {
        const eventDirs = fs
            .readdirSync('./src/events')
            .filter(dir => !this.isUnixHiddenPath(dir));

        for (const dir of eventDirs) {
            const eventFiles = fs
                .readdirSync(`./src/events/${dir}`)
                .filter(file => file.endsWith('.js'));

            for (const file of eventFiles) {
                const Event = require(`../events/${dir}/${file}`);
                const event = new Event(this);

                this.events.set(event.name, event);
                event.emitter[event.type](event.name, (...args) =>
                    event.run(...args)
                );
            }
        }
        this.logger.load(
            `Loaded ${this.events.size} event${
                this.events.size === 1 ? '' : 's'
            }`
        );
    }

    loginMongo() {
        const mongo_url = `mongodb+srv://${this.config.mongo.credentials.username}:${this.config.mongo.credentials.password}@${this.config.mongo.url}/${this.config.mongo.database}?retryWrites=true&w=majority`;

        mongoose
            .connect(mongo_url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            })
            .catch(err => {
                this.logger.error(
                    `Failed to connect to Mongo database: ${err}`
                );
            });

        mongoose.connection.on('connecting', () => {
            this.logger.event(`Establishing Mongo connection...`);
        });

        mongoose.connection.on('connected', () => {
            this.logger.event(`Mongo connection established!`);
        });

        mongoose.connection.on('error', () => {
            this.logger.error(`A Mongo error has occured`);
        });

        mongoose.connection.on('disconnected', () => {
            this.logger.event(`Mongo connection disconnected`);
        });

        const exitHandler = (options, exitCode) => {
            if (options.cleanup) {
                this.logger.event(`Cleaning up...`);

                mongoose.connection.close().catch(err => {
                    this.logger.error(
                        `Failed to close Mongo connection: ${err}`
                    );
                });

                this.logger.event('Mongo connection closed');
            }

            if (exitCode || exitCode === 0) {
                this.logger.event(
                    `Exited process with exit code (${exitCode})`
                );
            }

            if (options.exit) {
                process.exit();
            }
        };

        // do something when app is closing
        process.on(
            'exit',
            exitHandler.bind(null, {
                cleanup: true,
            })
        );

        // catches ctrl+c event
        process.on(
            'SIGINT',
            exitHandler.bind(null, {
                exit: true,
            })
        );

        // catches "kill pid" (for example: nodemon restart)
        process.on(
            'SIGUSR1',
            exitHandler.bind(null, {
                exit: true,
            })
        );
        process.on(
            'SIGUSR2',
            exitHandler.bind(null, {
                exit: true,
            })
        );

        // catches uncaught exceptions
        process.on(
            'uncaughtException',
            exitHandler.bind(null, {
                exit: true,
            })
        );
    }

    start() {
        this.loadCommands();
        this.loadEvents();
        this.loginMongo();
        super.login(this.config.token);
    }
};
