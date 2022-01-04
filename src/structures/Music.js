module.exports.Player = class Player {
    constructor(client, connection) {
        this.client = client;
        this.connection = connection;
        this.guild = connection.channel.guild;
        this.queue = [];
        this.playing = false;
        this.loop = false;
        this.volume = 100;

        // Clear the queue, leave, and delete the player
        this.connection.once('disconnect', () => {
            this.stop();
            this.client.queues.delete(this);
        });
    }

    pause() {
        this.playing = false;
        this.connection.dispatcher.pause();
    }

    resume() {
        this.playing = true;
        this.connection.dispatcher.resume();
    }

    loop() {
        this.loop = !this.loop;
    }

    // Clear the queue and leave
    stop() {
        this.clear();
        this.connection.leave();
    }

    // Clear the queue
    clear() {
        this.connection.dispatcher.end();
        queue = [];
    }

    volume(newVolume) {
        this.connection.dispather.setVolume(newVolume);
    }
};

module.exports.Song = class Song {
    constructor(options = {}) {
        this.title = options.title;
        this.url = options.url;
        this.requestor = options.requestor;
        this.image = options.image;
    }
};
