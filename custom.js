CUSTOM_ranks["TARS"] = 2;

var CUSTOM_stars = {};

/*
 * Schedule button.
 */
if($('#schedule_list').length) { $('#schedule_list').remove(); }
$('<div id="schedule_list" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Schedule</h4></div><div id="schedule_list_body" class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>').insertAfter('#useroptions');

if($('#schedule_button').length) { $('#schedule_button').unbind().remove(); }
$('#leftcontrols').prepend('<button id="schedule_button" title="Schedule" data-toggle="modal" data-target="#schedule_list" class="btn btn-sm btn-default">Nothing scheduled</button>').button();
$('#schedule_button').click(function() {
    var slb = $('#schedule_list_body');
    slb.empty();
    var s = "";
    s += '<table class="table table-striped table-condensed"><thead><tr><th>What</th><th>When</th></tr></thead><tbody>';
    $.each(_CUSTOM_schedule_data, function(k, v) {
        if ( (v[1] - new Date().getTime()) > 0 ) {
            s += '<tr class="text-center"><td class="vertical-middle"><b>' + v[0] + '</b></td><td class="vertical-middle">' + CUSTOM_schedule_format_time(CUSTOM_schedule_calculate_time(v[1])) + '</td></tr>';
        }
    });
    s += "</tbody></table>";
    
    slb.append(s);
});

var CUSTOM_schedule_calculate_time = function(time) {
    var msec = time - new Date().getTime();
    var dd = Math.floor(msec / 1000 / 60 / 60 / 24);
    msec -= dd * 1000 * 60 * 60 * 24;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    return [dd, hh, mm];
}

var CUSTOM_schedule_format_time = function(time_arr) {
    var s = "";
    if ( time_arr[0] ) s += time_arr[0] + 'd ';
    if ( time_arr[1] ) s += time_arr[1] + 'h ';
    s += time_arr[2] + 'm';
    return s;
};

var CUSTOM_schedule_get_next_event = function() {
    var e = null;
    if ( typeof(_CUSTOM_schedule_data) !== 'undefined' ) {
        for (var i = 0; i < _CUSTOM_schedule_data.length; i++) {
            if ( (_CUSTOM_schedule_data[i][1] - new Date().getTime()) > 0 ) {
                e = _CUSTOM_schedule_data[i];
                break;
            }
        };
        return [ _CUSTOM_schedule_data.length - i, e];
    }
    return [ null, null ];
}

var CUSTOM_schedule_update_button = function() {
    var ne = CUSTOM_schedule_get_next_event();
    if ( ne[1] ) {
        $('#schedule_button').html('[' + ne[0] + '] | ' + ne[1][0] + ' in ' + CUSTOM_schedule_format_time(CUSTOM_schedule_calculate_time(ne[1][1])));
    } else {
        $('#schedule_button').html('Nothing scheduled');
    }
}

CUSTOM_schedule_update_button();
if (typeof(_CUSTOM_schedule_interval) !== 'undefined') {
    clearInterval(_CUSTOM_schedule_interval);
}
var _CUSTOM_schedule_interval = setInterval(CUSTOM_schedule_update_button, 5 * 1000);

/*
 * Lyrics viewer
 */
if($('#lyrics_menu').length) { $('#lyrics_menu').unbind().remove(); }
$('#leftcontrols').prepend('<span id="lyrics_menu"><button id="lyrics_button" title="Lyrics" class="btn btn-sm btn-default" data-toggle="dropdown"><span class="glyphicon glyphicon-book"></span></button><ul class="dropdown-menu" role="menu"><li class="dropdown-submenu"><a tabindex="-1" href="#">Frozen</a><ul class="dropdown-menu"><li><a data-song="frozenheart" href="#">Frozen Heart</a></li><li><a data-song="dywtbas" href="#">Do You Want to Build a Snowman?</a></li><li><a data-song="ftftif" href="#">For the First Time in Forever</a></li><li><a data-song="liaod" href="#">Love is an Open Door</a></li><li><a data-song="letitgo" href="#">Let it Go</a></li><li><a data-song="rabtp" href="#">Reindeer(s) are Better than People</a></li><li><a data-song="insummer" href="#">In Summer</a></li><li><a data-song="ftftifr" href="#">For the First Time in Forever, Reprise</a></li><li><a data-song="fixerupper" href="#">Fixer-Upper</a></li><li class="divider"></li><li><a data-song="lts" href="#">Life\'s Too Short</a></li><li><a data-song="ltsr" href="#">Life\'s Too Short, Reprise</a></li><li class="divider"></li><li><a data-song="swe-ftftif" href="#">SWE: For the First Time in Forever</a></li><li><a data-song="swe-ftftifr" href="#">SWE: For the First Time in Forever, Reprise</a></li></ul></li><li class="dropdown-submenu"><a tabindex="-1" href="#">Tangled</a><ul class="dropdown-menu"><li><a data-song="wwmlb" href="#">When Will My Life Begin</a></li><li><a data-song="mkb" href="#">Mother Knows Best</a></li><li><a data-song="wwmlbr" href="#">When Will My Life Begin, Reprise</a></li><li><a data-song="igad" href="#">I\'ve Got a Dream</a></li><li><a data-song="mkbr" href="#">Mother Knows Best, Reprise</a></li><li><a data-song="istl" href="#">I See the Light</a></li><li><a data-song="healing" href="#">Healing Incantation</a></li><li><a data-song="stiw" href="#">Something That I Want</a></li></ul></li><li class="dropdown-submenu"><a tabindex="-1" href="#">Brave</a><ul class="dropdown-menu"><li><a data-song="tts" href="#">Touch the Sky</a></li><li><a data-song="itoa" href="#">Into the Open Air</a></li><li><a data-song="lmr" href="#">Learn me Right</a></li></ul></li></ul></span>');

var CUSTOM_add_lyrics = function(name) {
    $.ajax({
        url:'http://cdn.kuschku.de/lyrics/' + name,
        crossDomain: true,
        success:function(data){
            var div = $('<div/>');
            $('#pollwrap').prepend(div);
            div.html("<button class=\"close pull-right\">×</button>" + data + "<button class=\"close pull-right\">×</button>");
            div.addClass('text-center well lyrics');
            div.find('button').click(function() { div.remove(); });
        }
    })
    
}

$('#lyrics_menu a[data-song]').click(function(){
    CUSTOM_add_lyrics($(this).attr("data-song"));
});

/*
 * User intro
 */

CUSTOM_leave_timeout = 5 * 60*1000;
_userlist_leave_times = {};

var CUSTOM_get_timestamp = function() {
    return "[" + new Date().toTimeString().split(" ")[0] + "] ";
};

var CUSTOM_get_timestamp_html = function() {
    return '<span class="server-whisper timestamp">' + CUSTOM_get_timestamp() + '</span>';
};

var CUSTOM_say_joinleave_messsage = function(name, status) {
    if ( !USEROPTS.no_join ) {
        var message = '';
        if (USEROPTS.show_timestamps) {
            message += CUSTOM_get_timestamp_html();
        }
        message += '<span class="server-whisper">' + name + ' ' + status + '</span>';

        $('<div/>').html(message).appendTo('#messagebuffer');

        scrollChat();
    }
};

if (typeof(_userleave) == 'undefined') { _userleave = Callbacks.userLeave; }
Callbacks.userLeave = function(data) {
    _userleave(data);
    
    _userlist_leave_times[data.name] = $.now();

    CUSTOM_say_joinleave_messsage(data.name, "left");
};

var CUSTOM_process_intro_message = function(name) {
    if ( name in CUSTOM_intro && !( name in _userlist_leave_times && ($.now() - _userlist_leave_times[name]) < CUSTOM_leave_timeout) ) {
        $('<div/>').html(CUSTOM_intro[name]).appendTo('#messagebuffer');

        scrollChat();
    } else if ( CLIENT.rank < 2 ) {
        CUSTOM_say_joinleave_messsage(name, "joined");
    }
};

USEROPTS.no_join = false;
if($('#jointoggle').length) { $('#jointoggle').unbind().remove(); }
$('#modflair').before('<span id="jointoggle" title="Disable join/leave messages" class="label pull-right pointer label-default">J</span>');
$("#jointoggle").click(function () {
    var j = $("#jointoggle");
    if (j.hasClass("label-success")) {
        USEROPTS.no_join = false;
        j.removeClass("label-success").addClass("label-default");
    } else {
        USEROPTS.no_join = true;
        j.removeClass("label-default").addClass("label-success");
    }
});

/*
 * Userlist awards
 */
var CUSTOM_award_class = function(award_name) {
    return 'award_' + award_name;
};

var CUSTOM_process_award = function(div) {
    if ( (div.data("name") || "") in CUSTOM_awarded ) {
        div.addClass(CUSTOM_award_class(CUSTOM_awarded[div.data("name")]));
    }
};

var CUSTOM_process_star = function(div) {
    if (div.data("name") in CUSTOM_stars) {
        div.attr("data-star", CUSTOM_stars[div.data("name")]);
    } else {
        div.attr("data-star", "0");
    }
}

var CUSTOM_load_stars = function () {
    $.getJSON("https://secure.kuschku.de/cdn/awards.php", function(awards) {
        CUSTOM_stars = awards;
        CUSTOM_format_stars();
    });
}

if (typeof(_fui) == 'undefined') { _fui = formatUserlistItem; }
var formatUserlistItem = function(div) {
    _fui(div);
    
    CUSTOM_process_award(div);
    CUSTOM_process_star(div);

    if( div.data('rank') == 1.5 && div.find('.glyphicon-star-empty').length == 0 ) {
        $("<span/>").addClass("glyphicon glyphicon-star-empty").prependTo(div.children()[0]);
    }
};

var CUSTOM_format_stars = function () {
    $.each($('.userlist_item'), function(k, v) {
        CUSTOM_process_star($(v));
    });
}

$.each($('.userlist_item[class*=award]'), function(k, v) {;
    if ( !($(v).data("name") in CUSTOM_awarded) ) {
        $(v).removeClass(function (index, css) {
            return (css.match (/\baward_\S+/g) || []).join(' ');
        });
    }
});

$.each($('.userlist_item'), function(k, v) {
    formatUserlistItem($(v));
});

/*
 * Integration of ss7's Video Time Display plugin
 */
if($('#ss7_time_display').length) { $('#ss7_time_display').unbind().remove(); }
$('#videocontrols').prepend('<button id="ss7_time_display" title="Video Time Display by ss7, thank you!" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-time"></span></button>').button();
// ------- <code author="ss7">
$('#ss7_time_display').click(function() {
    if (typeof(_time) != 'undefined') {
            $('#_time').remove();
            delete(_time);
    } else {
            _time = {raw: 0, ofs: 0, paused: false};
            $('#rightcontrols').append('<div id="_time"><h4>00:00:00</h4></div>');
            f = function() {
                    if (typeof(_time) == 'undefined') { return; }
                    var t = _time.paused ? _time.raw : (new Date()).getTime()/1000 + _time.ofs;
                    setTimeout(f, 1000*(Math.round(t)+1 - t));
                    t = Math.round(t);
                    var s = t % 60; t = Math.floor(t/60);
                    var m = t % 60;
                    var h = Math.floor(t/60);
                    if (s < 10) { s = '0'+s; }
                    if (m < 10) { m = '0'+m; }
                    if (h < 10) { h = '0'+h; }
                    if (_time.ofs < 0) { $('#_time').html('<h4>'+h+':'+m+':'+s+'</h4>'); }
            };
            setTimeout(f, 0);
    }
});
// ------- </code>

/*
 * Emote List
 */
function name_compare(a,b) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}

if($('#emote_list').length) { $('#emote_list').remove(); }
$('<div id="emote_list" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Emote List</h4></div><div id="emote_list_body" class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>').insertAfter('#schedule_list');

if($('#emote_list_button').length) { $('#emote_list_button').unbind().remove(); }
$('#leftcontrols').prepend('<button id="emote_list_button" title="Emote List" data-toggle="modal" data-target="#emote_list" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-picture"></span>&nbsp;</button>').button();
$('#emote_list_button').click(function() {
    var elb = $('#emote_list_body');
    elb.empty();
    var s = "";
    var sorted_emotes = CHANNEL.emotes.sort(name_compare);
    s += '<table class="table table-striped table-condensed"><thead><tr><th>Name</th><th>Image</th></tr></thead><tbody>';
    $.each(CHANNEL.emotes, function(k, v) {
        if ( v.name.indexOf("MOD-ONLY") == -1 ) {
            s += '<tr class="text-center"><td class="vertical-middle">' + v.name + '</td><td class="vertical-middle"><img src="' + v.image + '" /></td></tr>';
        }
    });
    s += "</tbody></table>";
    
    elb.append(s);
});

/*
 * Extended Reload Video Player button
 */
$('#mediarefresh').insertAfter('#getplaylist').html('Reload Video Player &nbsp; <span class="glyphicon glyphicon-retweet"></span>');

/*
 * Rules modal
 */
if($('#rules_list').length) { $('#rules_list').remove(); }
$('<div id="rules_list" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Rules</h4></div><div id="rules_list_body" class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>').insertAfter('#emote_list');

if($('#rules_list_button').length) { $('#rules_list_button').unbind().remove(); }
$('#leftcontrols').prepend('<button id="rules_list_button" title="Rules List" data-toggle="modal" data-target="#rules_list" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-tower"></span>&nbsp;</button>').button();

(function(){
    var s = "";
    s += '<table class="table table-striped table-condensed"><thead><tr><th id="rule-id">#</th><th>Rule</th></tr></thead><tbody>';
    $.each(CUSTOM_RULES, function(k, v) {
        s += '<tr class="text-center"><td class="vertical-middle"><strong>' + k + '</strong></td><td class="text-left vertical-middle">' + v + '</td></tr>';
    });
    s += "</tbody></table>";
    $('#rules_list_body').html(s);
})();

/*
 * Capture modal
 */
if( ! $('#capture_list').length) {
    $('<div id="capture_list" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Capture List</h4></div><div id="capture_list_body" class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>').insertAfter('#rules_list');
}

if($('#capturebutton').length) { $('#capturebutton').unbind().remove(); }
$('#modflair').before('<span id="capturebutton" title="Disable join/leave messages" data-toggle="modal" data-target="#capture_list" class="label pull-right pointer label-default">C</span>');

if (typeof(_addchatmessage) == 'undefined') { _addchatmessage = addChatMessage; }
var addChatMessage = function(data) {
    _addchatmessage(data);
    
    if (data.msg.indexOf("$star ") === 0) {
        CUSTOM_load_stars();
    }

    if (CLIENT.name && data.username != CLIENT.name) {
        if (data.msg.toLowerCase().indexOf(CLIENT.name.toLowerCase()) != -1) {
            if(data.meta.addClass === "server-whisper") {
                return;
            }
            CUSTOM_add_capture_message(data);
        }
    }
};

var LASTCAPTURE = {
    name: ""
};
var CUSTOM_add_capture_message = function(data) {
    $('#capture_list_body').append(formatChatMessage(data, LASTCAPTURE));
};


/*
 * Emote disabling
 */
if($('#emotetoggle').length) { $('#emotetoggle').unbind().remove(); }
$('#modflair').before('<span id="emotetoggle" title="Emote Disable" class="label pull-right pointer label-default">ED</span>');
$("#emotetoggle").click(function () {
    var ed = $("#emotetoggle");
    if (ed.hasClass("label-success")) {
        USEROPTS.no_emotes = false;
        ed.removeClass("label-success").addClass("label-default");
    } else {
        USEROPTS.no_emotes = true;
        ed.removeClass("label-default").addClass("label-success");
    }
});


/*
 * Voteskip button text
 */
function CUSTOM_prepend_voteskip_text() {
    $('#voteskip').prepend("Voteskip ");
}

if ( $('#voteskip').text().indexOf('Voteskip ') == -1 ) {
    CUSTOM_prepend_voteskip_text();
}

if (typeof(_voteskip) == 'undefined') { _voteskip = Callbacks.voteskip; }
Callbacks.voteskip = function(data) {
    _voteskip(data);
    
    CUSTOM_prepend_voteskip_text();
}

var CUSTOM_user_has_rank = function(user, rank) {
    if ( user in CUSTOM_ranks && CUSTOM_ranks[user] >= rank ) {
        return true;
    }
    return false;
};

var CUSTOM_user_has_star_permission = function(user) {
    if(
        CUSTOM_user_has_rank(user, 2) ||
        ( user in CUSTOM_awarded && /star|regular/.test(CUSTOM_awarded[user]) )
    ) {
        return true;
    }
    return false;
}

/*
 * Custom image embedding
 */
var CUSTOM_process_image_embed = function(msg) {
    if (USEROPTS.no_emotes)
        return msg;
    msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!!\" target=\"_blank\"\>(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!!\<\/a\>/ig, '<a href="$1" target="_blank"><img src="$1" class="channel-user-emote" /></a>');
    return msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!\" target=\"_blank\"\>(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!\<\/a\>/ig, '<a href="$1" target="_blank"><img src="$1" class="channel-emote" /></a>');
}

var CUSTOM_process_image_embed_on_chatMsg = function(data) {
    if( CUSTOM_user_has_rank(data.username, 2)) {
        data.msg = CUSTOM_process_image_embed(data.msg);
    }
    return data;
}

var CUSTOM_process_image_embed_on_messagebuffer = function() {
    $.each($('#messagebuffer div'), function(k, v) {
        try {
            var sender = /chat-msg-(\w+)/.exec($(v).attr("class"))[1];
        } catch (e) {
            console.log("CUSTOM -- Skipped div " + k + " on retroactive image embed");
            console.log(e);
            var sender = null;
        }
        if ( sender && CUSTOM_user_has_rank(sender, 2) ) {
            $(v).html(CUSTOM_process_image_embed($(v).html()));
        }
    });
}

var CUSTOM_process_image_embed_on_pm = function(data) {
    if( CUSTOM_user_has_rank(data.username, 2) ) {
        data.msg = CUSTOM_process_image_embed(data.msg);
    }
    return data;
}


/*
 * Custom chat colors
 */
var CUSTOM_process_color = function(msg) {
    msg = msg.replace(/br\{(.*?)\}/ig, '<span class="browntext">$1</span>');
    msg = msg.replace(/r\{(.*?)\}/ig, '<span class="redtext">$1</span>');
    msg = msg.replace(/g\{(.*?)\}/ig, '<span class="annatext">$1</span>');
    msg = msg.replace(/b\{(.*?)\}/ig, '<span class="elsatext">$1</span>');
    msg = msg.replace(/o\{(.*?)\}/ig, '<span class="oranjetext">$1</span>');
    msg = msg.replace(/y\{(.*?)\}/ig, '<span class="yellowtext">$1</span>');
    msg = msg.replace(/p\{(.*?)\}/ig, '<span class="purpletext">$1</span>');
    msg = msg.replace(/ea\{(.*?)\}/ig, '<span class="elsannatext">$1</span>');
    return msg.replace(/ka\{(.*?)\}/ig, '<span class="kristannatext">$1</span>');
};

var CUSTOM_process_color_on_chatMsg = function(data) {
    if( CUSTOM_user_has_star_permission(data.username) ) {
        data.msg = CUSTOM_process_color(data.msg);
    }
    return data;
};

var CUSTOM_process_color_on_messagebuffer = function() {
    $.each($('#messagebuffer div'), function(k, v) {
        try {
            var sender = /chat-msg-(\w+)/.exec($(v).attr("class"))[1];
        } catch (e) {
            console.log("CUSTOM -- Skipped div " + k + " on retroactive color");
            console.log(e);
            var sender = null;
        }
        if ( sender && CUSTOM_user_has_star_permission(sender) ) {
            $(v).html(CUSTOM_process_color($(v).html()));
        }
    });
};

var CUSTOM_process_color_on_pm = function(data) {
    if( CUSTOM_user_has_star_permission(data.username) ) {
        data.msg = CUSTOM_process_color(data.msg);
    }
    return data;
};


/*
 * Emote name autocomplete
 */
var emoteTabComplete = function(elem) {
        /*
         * The following code is a repurposed version of the original chatTabComplete, hardly any innovation here
         */
        var words = elem.val().split(" ");
        var current = words[words.length - 1].toLowerCase();
        if (!current.match(/^\/[\w-]*$/))
            return;

        var emote_name_array = Array.prototype.slice.call(CHANNEL.emotes).map(function(elem) { return elem.name });
        var emotes = Array.prototype.slice.call(emote_name_array).map(function (emote_name) {
            return emote_name.toLowerCase();
        }).filter(function (name) {
            return name.indexOf(current) === 0;
        });

        if (emotes.length === 0) {
            return;
        }

        // trim possible names to the shortest possible completion
        var min = Math.min.apply(Math, emotes.map(function (name) {
            return name.length;
        }));
        emotes = emotes.map(function (name) {
            return name.substring(0, min);
        });

        var changed = true;
        var iter = 21;
        while (changed) {
            changed = false;
            var first = emotes[0];
            for (var i = 1; i < emotes.length; i++) {
                if (emotes[i] !== first) {
                    changed = true;
                    break;
                }
            }

            if (changed) {
                emotes = emotes.map(function (name) {
                    return name.substring(0, name.length - 1);
                });
            }

            // In the event something above doesn't generate a break condition, limit
            // the maximum number of repetitions
            if (--iter < 0) {
                break;
            }
        }

        current = emotes[0].substring(0, min);
        for (var i = 0; i < emote_name_array.length; i++) {
            if (emote_name_array[i].toLowerCase() === current) {
                current = emote_name_array[i];
                break;
            }
        }

        if (emotes.length === 1) {
            current += " ";
        }
        words[words.length - 1] = current;
        elem.val(words.join(" "));
}

if (typeof(_chattabcomplete) == 'undefined') { _chattabcomplete = chatTabComplete; }
var chatTabComplete = function() {
    var original = $('#chatline').val();
    _chattabcomplete();
    var after = $('#chatline').val();
    if ( original == after ) {
        emoteTabComplete($('#chatline'));
    }
}

/*
 * Praise messages /hhhehehe
 */
var CUSTOM_praise_response = function(data, trigger, response) {
    var match = data.msg.match(/^praise (.*)/i);
    var str = match[1].replace(/<img.*title=\"(.*)\">/g, "$1");
    if( match &&
        data.meta.modflair >= 3 &&
        CLIENT.logged_in == true &&
        !$(findUserlistItem(CLIENT.name)).data('afk')) {
        socket.emit("chatMsg", { 'msg': str });
    }
}

if (typeof(_chatmsg) == 'undefined') { _chatmsg = Callbacks.chatMsg; }
Callbacks.chatMsg = function(data) {
    data = CUSTOM_process_image_embed_on_chatMsg(data);
    data = CUSTOM_process_color_on_chatMsg(data);
    
    _chatmsg(data);
    
    CUSTOM_praise_response(data);
}


/*
 * Hiding FrozenBot anonymous count
 */
var calcUserBreakdown = function() {
    var breakdown = {
        "Site Admins": 0,
        "Channel Admins": 0,
        "Moderators": 0,
        "Regular Users": 0,
        "Guests": 0,
        "Anonymous": 0,
        "AFK": 0
    };
    var total = 0;
    $("#userlist .userlist_item").each(function (index, item) {
        if ( $(item).hasClass('award_hidden') ) { 
            return;
        }
        var data = {
            rank: $(item).data("rank")
        };

        if(data.rank >= 255)
            breakdown["Site Admins"]++;
        else if(data.rank >= 3)
            breakdown["Channel Admins"]++;
        else if(data.rank == 2)
            breakdown["Moderators"]++;
        else if(data.rank >= 1)
            breakdown["Regular Users"]++;
        else
            breakdown["Guests"]++;

        total++;

        if($(item).data("afk"))
            breakdown["AFK"]++;
    });

    breakdown["Anonymous"] = CHANNEL.usercount - total;

    return breakdown;
};

Callbacks.usercount = function(count) {
    count -= $('.award_hidden').length;
    CHANNEL.usercount = count;
    $("#usercount").text(count);
};

if (typeof(_chatOnly) == 'undefined') { _chatOnly = chatOnly; }
chatOnly = function() {
    _chatOnly();
    $('#showchansettings').text('CS');
    $('#chatheader span:contains("User Options")').text("UO");
};

/*
 * Emotes as <video> tags
 */

if (typeof(_formatChatMessage) == 'undefined') { _formatChatMessage = formatChatMessage; }
var formatChatMessage = function(data, last) {
    var div = _formatChatMessage(data, last);

    div.find("video").load(function () {
        if (SCROLLCHAT) {
            scrollChat();
        }
    });

    return div;
}

var execEmotes = function(msg) {
    if (USEROPTS.no_emotes) {
        return msg;
    }

    CHANNEL.emotes.forEach(function (e) {
        if ( e.image[e.image.length - 1] == "v" ) {
            var base_image = e.image.match(/(.*)\.gifv$/i)[1];
            msg = msg.replace(e.regex, '$1<video poster="' + base_image + '.jpg" class="channel-emote" title="' + e.name + '" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline=""><source src="' + base_image  + '.mp4" type="video/mp4" /><source src="' + base_image  + '.webm" type="video/webm" /></video>');
        } else {
            msg = msg.replace(e.regex, '$1<img class="channel-emote" src="' +
                                   e.image + '" title="' + e.name + '">');
        }
    });

    return msg;
}


/*
 * Blinking PM windows
 */
var CUSTOM_get_pm_window = function(username) {
    var pm_window = $('#pm-' + username);
    if( pm_window.length > 0 ) {
        return pm_window;
    }
};

if (typeof(_initpm) == 'undefined') { _initpm = initPm; }
var initPm = function(user) {
    var pm_window_pre = CUSTOM_get_pm_window(user);
    var pm_window = _initpm(user);
    if (!pm_window_pre) {
        pm_window.find('.panel-heading').click(function() {
            pm_window.data('new_message', false);
        });

        pm_window.find('.pm-input').keydown(function(ev) {
            if( ev.keyCode == 9 ) {
                var inp = $(pm_window.find('.pm-input')[0]);
                console.log(inp);
                emoteTabComplete(inp);
                ev.preventDefault();
                return false;
            }
        });
    }
    return pm_window;
}

if (typeof(_pm) == 'undefined') { _pm = Callbacks.pm; }
Callbacks.pm = function(data) {
    data = CUSTOM_process_color_on_pm(data);
    data = CUSTOM_process_image_embed_on_pm(data);

    _pm(data);

    var pm_window = CUSTOM_get_pm_window(data.username);

    if( pm_window.find('.panel-body').is(':hidden') ) {
        pm_window.data('new_message', true);
    }
}

var _CUSTOM_blinking_pm_windows_state = false;
var CUSTOM_blink_pm_windows = function() {
    $.each($('.pm-panel'), function(k, elem) {
        var e = $(elem);
        if ( e.data('new_message') ) {
            e
            .removeClass( _CUSTOM_blinking_pm_windows_state ? 'panel-default' : 'panel-primary' )
            .addClass( !_CUSTOM_blinking_pm_windows_state ? 'panel-default' : 'panel-primary' )
        }
    });

    _CUSTOM_blinking_pm_windows_state = _CUSTOM_blinking_pm_windows_state ? false : true;
};

if (typeof(_CUSTOM_pm_windows_interval) !== 'undefined') {
    clearInterval(_CUSTOM_pm_windows_interval);
}
var _CUSTOM_pm_windows_interval = setInterval(CUSTOM_blink_pm_windows, 1000);


var CUSTOM_init_complete = function() {
    if ( (typeof(_CUSTOM_init) == 'undefined') ) {
        if ( _CUSTOM_fallback_init_complete_timeout ) {
            clearTimeout(_CUSTOM_fallback_init_complete_timeout);
            _CUSTOM_fallback_init_complete_timeout = null;
        }
        
        CUSTOM_process_image_embed_on_messagebuffer();
        CUSTOM_process_color_on_messagebuffer();
        CUSTOM_process_intro_message(CLIENT.name);
        
        // The following deals with the case where the JS loaded after clicking Allow on JS security popup
        // does not get exposed to the early setMOTD message and the schedule needs to be processed again
        if(typeof(_CUSTOM_schedule_data) === 'undefined') {
            CUSTOM_schedule_process_MOTD();
        }

        Callbacks.usercount(CHANNEL.usercount);

        scrollChat();

        if (typeof(_extension_hook) !== 'undefined') { _extension_hook(); }

        _CUSTOM_init = true;
    }
}

var _CUSTOM_fallback_init_complete_timeout = setTimeout(CUSTOM_init_complete, 1000);

if (typeof(_mediaupdate) == 'undefined') { _mediaupdate = Callbacks.mediaUpdate; }
Callbacks.mediaUpdate = function(data) {
    _mediaupdate(data);
    
    if ( (typeof(_CUSTOM_init) == 'undefined') ) {
        CUSTOM_init_complete();
    }

    if (typeof(_time) != 'undefined') {
        _time.paused = data.paused;
        _time.raw = Math.max(data.currentTime, 0);
        _time.ofs = _time.raw - (new Date()).getTime()/1000;
    }
}

var CUSTOM_toggle_new_stars = function () {
    document.body.classList.toggle("new-stars");
}

if($('#startoggle').length) { $('#startoggle').unbind().remove(); }
$('#modflair').before('<span id="startoggle" title="Enable new Awards" class="label pull-right pointer label-default">S</span>');
$("#startoggle").click(function () {
    var ed = $("#startoggle");
    if (ed.hasClass("label-success")) {
        CUSTOM_toggle_new_stars();
        ed.removeClass("label-success").addClass("label-default");
    } else {
        CUSTOM_toggle_new_stars();
        ed.removeClass("label-default").addClass("label-success");
    }
});

CUSTOM_load_stars();