class YTChat {
    script_url = path + "data/livechat/chat.py";
    parent_selector;
    vid_url = "";

    buffer = [];
    interval = 20;

    buffer_update_timer;    // setTimeout -- dependent on player time
    chat_update_timer;      // setInterval -- independent operation
    last_buffer_update;
    paused = false;

    toggle(parent_selector) {
        if (this.parent_selector) this.unload();
        else this.load(parent_selector);
    }

    load(parent_selector) {
        this.parent_selector = parent_selector;
        this.vid_url = PLAYER.yt.getVideoUrl();
        this.buffer = [];

        // Preload buffer and hook handler for media updates
        // Update timers will be set by mediaUpdate handler when vid plays
        let res = this.updateBuffer(0);
        if (!res) return false;

        socket.on("mediaUpdate", this.handleMediaUpdate);
        socket.on("playNext", this.unload);

        let chatWindow = $("<div>").attr("id", "ytchat-container");
        $(parent_selector).addClass("ytchat-active").append(chatWindow);
    }

    unload() {
        $(this.parent_selector)
            .removeClass("ytchat-active")
            .find("#ytchat-container")
            .remove();

        socket.off("mediaUpdate", this.handleMediaUpdate);
        socket.off("playNext", this.unload);
        clearTimeout(self.buffer_update_timer);
        clearInterval(self.chat_update_timer);

        this.buffer = [];
        this.vid_url = null;
        this.parent_selector = null;
    }

    // Set timeout/interval for buffer/chat updates respectively
    setUpdateIntervals(currentTime) {
        let self = this;
        let updateBufferHelper = function(startTime) {
            self.updateBuffer(startTime);
            self.buffer_update_timer = setTimeout(updateBufferHelper,
                self.interval,
                self.last_buffer_update + self.interval);
        }

        self.chat_update_timer = setInterval(self.updateChat, 1000, 1000);
        self.buffer_update_timer = setTimeout(updateBufferHelper,
            self.interval - (currentTime - self.last_buffer_update),
            self.last_buffer_update + self.interval);
    }

    // Update buffer w/ messages from server
    updateBuffer(startTime) {
        return $.getJSON(this.script_url, {
            url: this.vid_url,
            start_time: startTime
        }).done((data, _, __) => {
            this.buffer.unshift(...data);
            this.last_buffer_update = startTime;
            return true;
        }).fail((_, __, errorThrown) => {
            console.error(errorThrown);
            return false;
        });
    }

    // Update chat window w/ next x secs of messages from buffer
    updateChat(secs) {
        let msg, self = this;
        PLAYER.getTime(function(time) {
            // buffer is a FIFO list of msgs => start at last elem in arr
            // (removing elems from beginning of arr much less performant)
            while (msg = self.buffer.pop()) {
                // Messages that occur within the next x secs
                if (msg.time_in_seconds < time + secs) {
                    $("<p>")
                        .addClass("ytChatMsg")
                        .html(msg.message)
                        .appendTo("#ytchat-container");
                } else {
                    self.buffer.push(msg);
                    break;
                }
            }
        });
    }

    // Callback for socket mediaUpdate event
    handleMediaUpdate(media) {
        let self = this;
        PLAYER.getTime(function (time) {
            // Seeking more than 2s from current time should clear chat
            let clear_chat = Math.abs(time - media.time) > 2;
            if (clear_chat) {
                self.buffer = [];
                $("#ytchat-container").html();
                updateBuffer(media.time);

                // Reset timers if we seek on an already playing vid
                if (!media.paused && !self.paused) {
                    clearTimeout(self.buffer_update_timer);
                    clearInterval(self.chat_update_timer);
                    self.setUpdateIntervals(media.time);
                }
            }

            // Handle pause/play
            if (media.paused !== self.paused) {
                if (media.paused) {
                    clearTimeout(self.buffer_update_timer);
                    clearInterval(self.chat_update_timer);
                } else {
                    self.setUpdateIntervals(media.time);
                }

                self.paused = media.paused;
            }
        });
    }
}