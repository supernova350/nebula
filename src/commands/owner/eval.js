const Command = require('../../structures/Command');

function clean(text) {
    if (typeof text === 'string') {
        return text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
        return text;
    }
}

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Evaluates code',
            category: 'Owner',
            usage: '<code>',
            name: 'eval',
        });
    }

    async run(message, args) {
        try {
            const code = args.join(' ');
            let evaled = eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }

            message.channel.send(clean(evaled), { code: 'xl' });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
};
