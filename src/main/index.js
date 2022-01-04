const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/bot.js', {
    token: require('../../config.json').token,
});
const logger = require('../src/logger');

manager.on('shardCreate', shard => logger.load(`Launched shard ${shard.id}`));
manager.spawn();
