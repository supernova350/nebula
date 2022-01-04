const chalk = require('chalk');
const moment = require('moment');

/**
 *
 * @param {String} content
 * @param {String} type
 * @param {chalk.color} color
 * @returns
 */

module.exports.log = (content, type = 'log', color = chalk.blue) => {
    const timestamp = `${chalk.gray('[')}${chalk.red(
        moment().format('YYYY-MM-DD HH:mm')
    )}${chalk.gray(']')}`;

    return console.log(
        `${timestamp} ${chalk.gray('[')}${color(type)}${chalk.gray(
            ']'
        )} ${content}`
    );

    // switch (type) {
    //     case 'log': {
    //         return console.log(
    //             `${timestamp} ${chalk.gray('[')}${chalk.blue(type)}${chalk.gray(
    //                 ']'
    //             )} ${content}`
    //         );
    //     }
    //     case 'warn': {
    //         return console.log(
    //             `${timestamp} ${chalk.gray('[')}${chalk.yellow(
    //                 type
    //             )}${chalk.gray(']')} ${content}`
    //         );
    //     }
    //     case 'error': {
    //         return console.log(
    //             `${timestamp} ${chalk.gray('[')}${chalk.red(type)}${chalk.gray(
    //                 ']'
    //             )} ${content}`
    //         );
    //     }
    //     case 'debug': {
    //         return console.log(
    //             `${timestamp} ${chalk.gray('[')}${chalk.green(
    //                 type
    //             )}${chalk.gray(']')} ${content}`
    //         );
    //     }
    //     case 'cmd': {
    //         return console.log(
    //             `${timestamp} ${chalk.gray('[')}${chalk.gray(type)}${chalk.gray(
    //                 ']'
    //             )} ${content}`
    //         );
    //     }
    //     case 'ready': {
    //         return console.log(
    //             `${timestamp} ${chalk.gray('[')}${chalk.green(
    //                 type
    //             )}${chalk.gray(']')} ${content}`
    //         );
    //     }
    //     case 'load': {
    //         return console.log(
    //             `${timestamp} ${chalk.gray('[')}${chalk.magenta(
    //                 type
    //             )}${chalk.gray(']')} ${content}`
    //         );
    //     }
    //     case 'event': {
    //         return console.log(
    //             `${timestamp} ${chalk.gray('[')}${chalk.cyan(type)}${chalk.gray(
    //                 ']'
    //             )} ${content}`
    //         );
    //     }
    //     default: {
    //         return;
    //     }
    // }
};

module.exports.warn = (...args) => this.log(...args, 'warn', chalk.yellow);
module.exports.error = (...args) => this.log(...args, 'error', chalk.red);
module.exports.debug = (...args) => this.log(...args, 'debug', chalk.green);
module.exports.cmd = (...args) => this.log(...args, 'cmd', chalk.grey);
module.exports.ready = (...args) => this.log(...args, 'ready', chalk.green);
module.exports.load = (...args) => this.log(...args, 'load', chalk.magenta);
module.exports.event = (...args) => this.log(...args, 'event', chalk.cyan);
