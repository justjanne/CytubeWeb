/* global CUSTOM */
/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/cytube/cytube.d.ts"/>
/// <reference path="typings/katex/katex.d.ts"/>
/// <reference path="typings/moment/moment.d.ts"/>

if (typeof (CUSTOM) === "undefined") CUSTOM = {
  init_done: false,
  resources: null,
  mediaType: null,
  volume: 0,
  hidden: false,
  shortSchedule: false,
  debug: false
};

(function () {
  var path;
  // Store original Cytube callbacks 
  var OriginalCallbacks = {};
  // Store even handlers
  var Handlers = {};
  var CustomOptions = {};

  if (window.location.hash === "#debug") {
    path = "http://localhost.kuschku.de/";
    CUSTOM.debug = true;
  } else if (window.location.hash === "#old") {
    path = "https://ssl.kuschku.de/cdn/"
  } else {
    path = "https://ssl.kuschku.de/cdn/beta/"
  }

  var Options = {
    "unfilter": {
      "displayname": "Undo some filters of common words",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    },
    "newchat": {
      "displayname": "New Chat Layout (beta)",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    },
    "chatcolors": {
      "displayname": "Colored Usernames (beta)",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    },
    "thinnames": {
      "displayname": "Thin Usernames (beta)",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    },
    "emote_disable": {
      "displayname": "Disable Emotes and Embeds",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    },
    "intro_disable": {
      "displayname": "Hide Join/Leave Messages",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    },
    "hideafkicons": {
      "displayname": "Hide AFK icons",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    },
    "transparentplayer": {
      "displayname": "Make Player Transparent, so other objects can show over it",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": true
    },
    "dateformat": {
      "displayname": "Preferred Date Format",
      "type": "selector",
      "names": ["2015-12-31", "12/31/2015", "31.12.2015", "Automatic"],
      "values": ["YYYY-MM-DD", "MM/DD/YYYY", "DD.MM.YYYY", "L"],
      "default": "L"
    },
    "timeformat": {
      "displayname": "Preferred Time Format",
      "type": "selector",
      "names": ["16:02", "4:02 PM", "Automatic"],
      "values": ["H:mm", "h:mm A", "LT"],
      "default": "LT"
    },
    "language": {
      "displayname": "Language",
      "type": "selector",
      "names": ["Automatic", "English", "Afrikaans", "Arabic (Morocco)", "Arabic (Saudi Arabia)", "Arabic (Tunisia)", "Arabic", "Azeri (Latin)", "Belarusian", "Bulgarian", "Catalan", "Czech", "Welsh", "Danish", "German (Austria)", "German", "Greek", "English (Australia)", "English (Canada)", "English (United Kingdom)", "Esperanto", "Spanish", "Estonian", "Basque", "Farsi", "Finnish", "Faroese", "French (Canada)", "French", "Galician", "Hebrew", "Hindi", "Croatian", "Hungarian", "Armenian (Armenia)", "Indonesian", "Icelandic", "Italian", "Japanese", "Georgian", "Korean", "Lithuanian", "Latvian", "FYRO Macedonian", "Marathi", "Malay (Malaysia)", "Malay", "Norwegian (Bokmål)", "Dutch", "Polish", "Portuguese (Brazil)", "Portuguese", "Romanian", "Russian", "Slovak", "Slovenian", "Albanian", "Swedish", "Tamil", "Thai", "Tagalog (Philippines)", "Turkish", "Ukrainian", "Uzbek (Latin)", "Vietnamese", "Chinese (China)", "Chinese (Taiwan)"],
      "values": ["auto", "en", "af", "ar-ma", "ar-sa", "ar-tn", "ar", "az", "be", "bg", "ca", "cs", "cy", "da", "de-at", "de", "el", "en-au", "en-ca", "en-gb", "eo", "es", "et", "eu", "fa", "fi", "fo", "fr-ca", "fr", "gl", "he", "hi", "hr", "hu", "hy-am", "id", "is", "it", "ja", "ka", "ko", "lt", "lv", "mk", "mr", "ms-my", "my", "nb", "nl", "pl", "pt-br", "pt", "ro", "ru", "sk", "sl", "sq", "sv", "ta", "th", "tl-ph", "tr", "uk", "uz", "vi", "zh-cn", "zh-tw"],
      "default": "auto"
    },
    "large-chat": {
      "displayname": "Large Chat",
      "type": "none",
      "default": false
    },
    "hide-video": {
      "displayname": "Hide Video",
      "type": "none",
      "default": false
    }
  }
   
  // Ressources
  if (CUSTOM.resources === null)
    CUSTOM.resources = {
      "stars": {
        "url": path + "data/stars.php",
        "callback": [],
        "data": null,
      },
      "awards": {
        "url": path + "data/awards.json",
        "callback": [],
        "data": null,
      },
      "rules": {
        "url": path + "data/rules.json",
        "callback": [],
        "data": null,
      },
      "lyrics": {
        "url": path + "data/lyrics.json",
        "callback": [],
        "data": null,
      },
      "intro": {
        "url": path + "data/intro.json",
        "callback": [],
        "data": null,
      },
      "ranks": {
        "url": "motd://ranks",
        "callback": [],
        "data": null
      },
      "schedule": {
        "url": "motd://schedule",
        "callback": [],
        "data": null,
      },
      "permissions": {
        "url": "motd://permissions",
        "callback": [],
        "data": null,
      },
    };

  var externalScripts = [
    {
      "type": "css",
      "url": path + "custom.css",
      "callback": []
    },
    {
      "type": "js",
      "url": path + "moment.js",
      "callback": []
    },
    {
      "type": "css",
      "url": path + "katex.min.css",
      "callback": []
    },
    {
      "type": "js",
      "url": path + "katex.min.js",
      "callback": []
    }
  ];

  var runEveryMinute = function (callback) {
    setTimeout(function () {
      setTimeout(function () {
        var x = setInterval(function () { callback(x); }, 60000);
      }, 60000 - 1000 * new Date().getUTCSeconds());
    }, 1000 - new Date().getUTCMilliseconds());
  }

  var callHandler = function (name, arg) {
    if (Handlers[name] === undefined) Handlers[name] = [];
    Handlers[name].forEach(function (func) {
      func(arg);
    });
  }

  var registerHandler = function (name, func) {
    if (Handlers[name] === undefined) Handlers[name] = [];
    Handlers[name].push(func);
  }

  var unregisterHandler = function (name, func) {
    if (Handlers[name] === undefined) Handlers[name] = [];
    Handlers[name] = Handlers[name].filter(function (el) { return el !== func });
  }

  var registerCallback = function (name, func) {
    if (!OriginalCallbacks.hasOwnProperty(name)) {
      OriginalCallbacks[name] = Callbacks[name];
      Callbacks[name] = function (e) {
        if (CUSTOM.debug) console.debug(name);
        if (CUSTOM.debug) console.debug(JSON.parse(JSON.stringify(e)));
        func(e, OriginalCallbacks[name]);
        callHandler(name, e);
      }
    }
  }

  var set_body_class = function (name, enable) {
    if (enable) document.body.classList.add(name);
    else document.body.classList.remove(name);
  }

  var display_button = function (id, enable) {
    if (enable) {
      $('#btn_' + id).addClass("label-success").removeClass("label-default");
    } else {
      $('#btn_' + id).addClass("label-default").removeClass("label-success");
    }
  }

  var set_option = function (name, value) {
    CustomOptions[name] = value;
    store_options();
    apply_options();
  }

  var get_option = function (name) {
    if (!CustomOptions.hasOwnProperty(name) && Options.hasOwnProperty(name)) {
      set_option(name, Options[name].default);
      console.log("Initializing option " + name + " with default value " + Options[name].default);
      console.trace();
    }
    return CustomOptions[name];
  }

  var store_options = function () {
    localStorage.setItem("yepityha-custom-options", JSON.stringify(CustomOptions));
  }

  var init_overloads = function () {
    if (typeof Math.modulo != 'function') {
      Math.modulo = function (a, b) {
        var x = (a % b);
        if (x < 0)
          return x + b;
        else
          return x;
      }
    }

    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
      };
    }

    if (typeof String.prototype.endsWith != 'function') {
      String.prototype.endsWith = function (str) {
        return this.slice(-str.length) == str;
      };
    }

    if (typeof String.prototype.hash != 'function') {
      String.prototype.hash = function () {
        return this.split("").map(function (a) { return a.charCodeAt(0); }).reduce(function (a, b) { return ((b << 5) - b) + a; });
      }
    }
  }

  var hideVideo = function () {
    hidePlayer();
    $('#chatwrap').removeClass('col-lg-5 col-md-5').addClass('col-md-12');
    $('#videowrap').hide();
    PLAYER.getVolume(function (vol) {
      CUSTOM.volume = vol;
      PLAYER.setVolume(0);
    });
    CUSTOM.hidden = true;
  }

  var unhideVideo = function () {
    $('#videowrap').show();
    $('#chatwrap').addClass('col-lg-5 col-md-5').removeClass('col-md-12');
    unhidePlayer();
    PLAYER.setVolume(CUSTOM.volume);
    CUSTOM.hidden = false;
  }

  var apply_hidden_video = function (enabled) {
    if (!CUSTOM.hidden && enabled) hideVideo();
    else if (CUSTOM.hidden && !enabled) unhideVideo();
  }

  formatChatMessage = function (e, t) {
    var internal_formatChatMessage = function (e, t) {
      (!e.meta || e.msgclass) && (e.meta = {
        addClass: e.msgclass,
        addClassToNameAndTimestamp: e.msgclass
      });
      var a = e.username === (t.name || t.username);
      if ("server-whisper" === e.meta.addClass || "custom-intro" === e.meta.addClass) {
        a = true;
      }
      if (e.msg.match(/^\s*<strong>\w+\s*:\s*<\/strong>\s*/)) {
        a = false
      }
      if (e.meta.forceShowName) {
        a = false
      }
      e.msg = execEmotes(e.msg)
      t.name = e.username;
      var s = $("<div/>");
      if ("drink" === e.meta.addClass && (s.addClass("drink"), e.meta.addClass = ""), USEROPTS.show_timestamps) {
        var n = $("<span/>").addClass("timestamp").appendTo(s),
          o = new Date(e.time).toTimeString().split(" ")[0];
        n.text("[" + o + "] "), e.meta.addClass && e.meta.addClassToNameAndTimestamp && n.addClass(e.meta.addClass)
      }
      var i = $("<span/>");
      if (!a && !e.meta.action) {
        $("<strong/>").addClass("username").text(e.username + ": ").appendTo(i);
        if (e.meta.modflair) {
          i.addClass(getNameColor(e.meta.modflair))
        }
        if (e.meta.addClass && e.meta.addClassToNameAndTimestamp) {
          i.addClass(e.meta.addClass)
        }
        if (e.meta.superadminflair) {
          i.addClass("label").addClass(e.meta.superadminflair.labelclass);
          $("<span/>").addClass(e.meta.superadminflair.icon).addClass("glyphicon").css("margin-right", "3px").prependTo(i)
        }
      }
      i.appendTo(s);
      var r = $("<span/>").appendTo(s);
      if (e.data) {
        $.each(e.data, function (key, value) {
          s.attr("data-" + key, value);
        });
      }
      return r[0].innerHTML = e.msg, e.meta.action && (i.html(""), r[0].innerHTML = e.username + " " + e.msg), e.meta.addClass && r.addClass(e.meta.addClass), e.meta.shadow && s.addClass("chat-shadow"), s.find("img").load(function () {
        SCROLLCHAT && scrollChat()
      }), s
    }

    var res = internal_formatChatMessage(e, t);
    if (e.data) {
      $.each(e.data, function (key, value) {
        res.attr("data-" + key, value);
      });
    }

    if (res.children().size() == 2 &&
      res[0].className.startsWith("chat-msg-") &&
      res.attr("data-type") !== "intro") {
      $(res.children().get(0)).after('<span></span>');
    }

    if ($(res).find(".username")[0])
      $(res).find(".username")[0].style.color = colorize_nick($(res).find(".username")[0].innerHTML);

    return res;
  }

  execEmotes = function (e) {
    return (CHANNEL.emotes.forEach(function (t) {
      e = e.replace(t.regex, '$1<span class="emote-fallback">' + t.name + '</span><img class="channel-emote" src="' + t.image + '" title="' + t.name + '">')
    }), e)
  }

  chatOnly = function () {
    var e = $("#chatwrap").detach();
    removeVideo();
    $("#wrap").remove();
    $("footer").remove();
    e.prependTo($("body"));
    e.css({
      "min-height": "100%",
      "min-width": "100%",
      margin: "0",
      padding: "0"
    });
    add_button("user-options", "User Options", function () {
      showUserOptions();
      return false;
    });
    add_button("chan-settings", "Channel Settings", function () {
      $("#channeloptions").modal();
      return false;
    });
    add_button("emote-list", "Emote List", function () {
      EMOTELIST.show();
      return false;
    });

    // Unhide
    $("#btn_schedule").show();
    $("#btn_ruleslist").show();
    $("#btn_settings").show();

    CUSTOM.shortSchedule = true;
    renderScheduleButton();
    $("#btn_large-chat").hide();
    $("#btn_hide-video").hide();
    setVisible("#btn_chan-settings", CLIENT.rank >= 2);
    $("body").addClass("chatOnly");
    handleWindowResize()
  }

  var loadExternal = function () {
    var requestCSS = function (val) {
      var tag = document.createElement("link");
      tag.type = "text/css";
      tag.rel = "stylesheet";
      tag.href = val.url;
      document.head.appendChild(tag);
      $(tag).ready(function () {
        val.callback.forEach(function (f) { f(); });
      });
    }

    externalScripts.forEach(function (val) {
      if (val.type === "css") requestCSS(val);
      else if (val.type === "js") $.getScript(val.url).done(function () {
        val.callback.forEach(function (f) { f(); })
      });
    });
  }
  
  // Load ressource from motd
  var extractFromMotd = function (url, callback) {
    var cleanurl = url.substr("motd://".length);
    var regex = new RegExp(cleanurl + "\\:\\:(\\[.*\\]|\\{.*\\})");

    var html = $("#motd").html() || "";
    var matches = html.match(regex);
    html = html.replace(regex, "");
    $("#motd").html(html);

    if (matches) {
      callback($.parseJSON(matches[1]));
    }
  }
  
  // Load ressources and fire callbacks
  var loadData = function () {
    $.each(CUSTOM.resources, function (key, value) {
      var handler;

      if (value.url.startsWith("motd://")) {
        handler = extractFromMotd;
      } else {
        handler = function (url, callback) {
          return $.getJSON(url + "?_" + new Date().getTime(), callback);
        }
      }

      handler(value.url, function (json) {
        CUSTOM.resources[key].data = json;
        CUSTOM.resources[key].callback.forEach(function (f) { f(); });
      });
    });
  }
  
  // Render stars
  var renderStars = function () {
    $.each($('.userlist_item'), function (key, value) {
      var elem = $(value);
      if (CUSTOM.resources.stars.data.hasOwnProperty(elem.data("name"))) {
        elem.attr("data-star", CUSTOM.resources.stars.data[elem.data("name")]);
      } else {
        elem.attr("data-star", "0");
      }
    });
  };
  CUSTOM.resources.stars.callback.push(renderStars);

  var getIntroFromName = function (name, count) {
    var getStatusFromCount = function (count) {
      if (count < 0) return "left";
      if (count > 0) return "joined";
      else return "nipped out";
    }
    var status = getStatusFromCount(count);
    if (name in CUSTOM.resources.intro.data && count > 0) {
      return { username: "server", msg: CUSTOM.resources.intro.data[name], meta: { addClass: "custom-intro" }, data: { type: "intro" }, time: new Date().getTime() };
    } else {
      return { username: "server", msg: name + " " + status, meta: { addClass: "server-whisper" }, data: { type: "intro" }, time: new Date().getTime() };
    }
  }

  var process_msg = function (data) {
    var embed_image = function (msg) {
      msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.webm|\.mp4)!!\" target=\"_blank\"\>(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.webm|\.mp4)!!\<\/a\>/ig,
        '<a href="$1$2" target="_blank"><span class="emote-fallback">$1$2</span><video src="$1$2" class="channel-user-emote" autoplay muted loop webkit-playsinline/></a>');
      msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.webm|\.mp4)!\" target=\"_blank\"\>(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.webm|\.mp4)!\<\/a\>/ig,
        '<a href="$1$2" target="_blank"><span class="emote-fallback">$1$2</span><video src="$1$2" class="channel-emote" autoplay muted loop webkit-playsinline/></a>');
      msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.gifv)!!\" target=\"_blank\"\>(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.gifv)!!\<\/a\>/ig,
        '<a href="$1.webm" target="_blank"><span class="emote-fallback">$1.webm</span><video src="$1.webm" class="channel-user-emote" autoplay muted loop webkit-playsinline/></a>');
      msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.gifv)!\" target=\"_blank\"\>(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.gifv)!\<\/a\>/ig,
        '<a href="$1.webm" target="_blank"><span class="emote-fallback">$1.webm</span><video src="$1.webm" class="channel-emote" autoplay muted loop webkit-playsinline/></a>');
      msg = msg.replace(/\<a href=\"(\w+:\/\/gfycat\.com)((?::\d+)?(?:\/[^\/\s]*)*)!!\" target=\"_blank\"\>(\w+:\/\/gfycat\.com)((?::\d+)?(?:\/[^\/\s]*)*)!!\<\/a\>/ig,
        '<a href="http://gfycat.com$2" target="_blank"><span class="emote-fallback">http://gfycat.com$2</span><video class="channel-user-emote" autoplay loop muted webkit-playsinline><source src="http://zippy.gfycat.com$2.webm"><source src="http://fat.gfycat.com$2.webm"><source src="http://giant.gfycat.com$2.webm"></video></a>');
      msg = msg.replace(/\<a href=\"(\w+:\/\/gfycat\.com)((?::\d+)?(?:\/[^\/\s]*)*)!\" target=\"_blank\"\>(\w+:\/\/gfycat\.com)((?::\d+)?(?:\/[^\/\s]*)*)!\<\/a\>/ig,
        '<a href="http://gfycat.com$2" target="_blank"><span class="emote-fallback">http://gfycat.com$2</span><video class="channel-emote" autoplay loop muted webkit-playsinline><source src="http://zippy.gfycat.com$2.webm"><source src="http://fat.gfycat.com$2.webm"><source src="http://giant.gfycat.com$2.webm"></video></a>');
      msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!!\" target=\"_blank\"\>(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!!\<\/a\>/ig,
        '<a href="$1" target="_blank"><span class="emote-fallback">$1</span><img src="$1" class="channel-user-emote" /></a>');
      msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!\" target=\"_blank\"\>(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!\<\/a\>/ig,
        '<a href="$1" target="_blank"><span class="emote-fallback">$1</span><img src="$1" class="channel-emote" /></a>');
      return msg;
    }

    var colors = ["redtext", "oranjetext", "yellowtext", "kristannatext", "annatext", "elsannatext", "elsatext", "purpletext"];

    var process_rainbow = function (data) {
      var transform_rainbow_character = function (base) {
        return function (char, i) {
          return '<span class="' + colors[(base + i) % colors.length] + '">' + char + '</span>';
        }
      }

      var transform_rainbow_node = function (node, offset) {
        if (node.nodeType === node.TEXT_NODE) {
          var new_elem = document.createElement("span");
          new_elem.innerHTML = node.textContent.split("").map(transform_rainbow_character(offset)).join("");
          return new_elem;
        } else {
          var count = node.childNodes.length;
          for (var i = 0; i < count; i++) {
            var old_node = node.removeChild(node.childNodes[0]);
            var new_node = transform_rainbow_node(old_node, offset);
            offset += old_node.textContent.length;
            node.appendChild(new_node);
          }
          return node;
        }
      }

      var transform_rainbow = function (text) {
        var mydiv = document.createElement("div");
        mydiv.innerHTML = text;
        transform_rainbow_node(mydiv, 0);
        return mydiv.innerHTML;
      }

      var rainbow = function (text) {
        var pattern = /rain{(.*)}/;
        if (text.match(pattern))
          return text.replace(pattern, transform_rainbow(text.match(pattern)[1]));
        else
          return text;
      }
      data.msg = rainbow(data.msg);
      return data;
    }

    var process_tex = function (data) {
      var fixtext = function (str) {
        str = str.substr(2, data.msg.length - 4);
        var r = $("<div></div>");
        r.html(str);
        r.find(".bold").each(function (i, el) {
          $(el).replaceWith("* " + $(el).html() + " *");
        });
        r.find(".mirror").each(function (i, el) {
          $(el).replaceWith("| " + $(el).html() + " |");
        });
        return r.text()
      }

      if (typeof (katex) !== "undefined") {
        try {
          data.msg = katex.renderToString(fixtext(data.msg));
        } catch (e) {
          console.error(e);
          console.log(fixtext(data.msg));
          console.log(data);
        }
      }
      return data;
    }

    var is_tex = function (data) {
      return data.msg.startsWith("$$") && data.msg.endsWith("$$");
    }

    var process_TARS_embed = function (msg) {
      if (msg.msg.startsWith("&#39;&#39;i&#39;")) {
        return {
          username: msg.msg.substr("&#39;&#39;i&#39;".length, msg.msg.indexOf(":") - "&#39;&#39;i&#39;".length),
          msg: msg.msg.substr(msg.msg.indexOf(":") + 2),
          meta: { addClass: "ghost", addClassToNameAndTimestamp: "ghost" },
          time: msg.time
        };
      } else if (msg.msg.startsWith("''i'")) {
        return {
          username: msg.msg.substr("''i'".length, msg.msg.indexOf(":") - "''i'".length),
          msg: msg.msg.substr(msg.msg.indexOf(":") + 2),
          meta: { addClass: "ghost", addClassToNameAndTimestamp: "ghost" },
          time: msg.time
        };
      } else {
        return msg;
      }
    }

    var process_colors = function (msg) {
      msg = msg.replace(/br\{(.*?)\}/ig, '<span class="browntext" data-color="brown">$1</span>');
      msg = msg.replace(/r\{(.*?)\}/ig, '<span class="redtext" data-color="red">$1</span>');
      msg = msg.replace(/g\{(.*?)\}/ig, '<span class="annatext" data-color="green">$1</span>');
      msg = msg.replace(/b\{(.*?)\}/ig, '<span class="elsatext" data-color="blue">$1</span>');
      msg = msg.replace(/o\{(.*?)\}/ig, '<span class="oranjetext" data-color="orange">$1</span>');
      msg = msg.replace(/y\{(.*?)\}/ig, '<span class="yellowtext" data-color="yellow">$1</span>');
      msg = msg.replace(/p\{(.*?)\}/ig, '<span class="purpletext" data-color="purple">$1</span>');
      msg = msg.replace(/ea\{(.*?)\}/ig, '<span class="elsannatext" data-color="turqoise">$1</span>');
      return msg.replace(/ka\{(.*?)\}/ig, '<span class="kristannatext" data-color="lime">$1</span>');
    };

    if (data.username === "TARS") data = process_TARS_embed(data);

    if (is_tex(data)) {
      data = process_tex(data);
    } else {
      if (CUSTOM.resources.ranks && CUSTOM.resources.ranks.data[data.username] >= 2) data.msg = embed_image(data.msg);
      data = process_rainbow(data);
      data.msg = process_colors(data.msg);
    }
    return data;
  };

  var init_timeDisplay = function () {
    var time_display_time = {};
    var time_display_update;
    var time_display_interval;

    time_display_update = function () {
      var t = time_display_time.paused ? time_display_time.raw : (new Date()).getTime() / 1000 + time_display_time.ofs;
      t = Math.round(t);
      var s = t % 60; t = Math.floor(t / 60);
      var m = t % 60;
      var h = Math.floor(t / 60);
      var fixed = function (a) {
        if (a < 10) return "0" + a
        else return a;
      }
      if (time_display_time.ofs < 0) { $('#time_display').html(fixed(h) + ':' + fixed(m) + ':' + fixed(s)); }
    }

    $('#ss7_time_display').unbind().remove();
    $('#videocontrols').prepend('<button id="ss7_time_display" title="Video Time Display by ss7, thank you!" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-time"></span><span id="time_display">00:00:00</span></button>').button();

    $('#ss7_time_display').click(function () {
      $('#time_display').toggleClass('hide');
    });

    registerCallback("mediaUpdate", function (e, original) {
      original(e);
      CUSTOM.mediaType = e.type;
      if (typeof (time_display_time) !== 'undefined') {
        time_display_time.paused = e.paused;
        time_display_time.raw = Math.max(e.currentTime, 0);
        time_display_time.ofs = time_display_time.raw - (new Date()).getTime() / 1000;
        time_display_update();

        if (undefined !== time_display_interval) clearInterval(time_display_interval);
        if (!time_display_time.paused) {
          time_display_interval = setInterval(function () {
            time_display_time.raw += 1;
            time_display_update();
          }, 1000);
        }
      }
    });
  }

  var match_highlight = function (nick, msg) {
    return nick !== undefined && nick !== "" && msg.username !== nick &&
      (msg.msg.toLowerCase().indexOf(nick.toLowerCase()) !== -1 ||
        msg.msg.toUpperCase().indexOf(nick.toUpperCase()) !== -1) &&
      msg.meta.addClass !== "server-whisper";
  }

  var process_msgbuffer = function () {
    var parse_message = function (obj) {
      if (!obj.attr("class").startsWith("chat-msg")) return null;

      var getRankFromColor = function (c) {
        return c === 'userlist_siteadmin' ? Rank.Siteadmin :
          c === 'userlist_owner' ? Rank.Admin :
            c === 'userlist_op' ? Rank.Moderator :
              c === 'userlist_guest' ? Rank.Guest :
                Rank.Member;
      }

      var timeText = $(obj.children()[0]).text();
      var username = obj.attr("class").substr("chat-msg-".length)
      var msg = $(obj.children().last()).html();

      timeText = timeText.substr(1, 8);
      var timeData = timeText.split(":")
      var time = new Date();
      time.setHours(+timeData[0]);
      time.setMinutes(+timeData[1]);
      time.setSeconds(+timeData[2]);

      var currentTime = new Date();
      if (currentTime < time) time.setDate(time.getDate() - 1)

      if (username.indexOf(" ") !== -1) { username = username.substr(0, username.indexOf(" ")) };
      if ($(obj.children().last()).hasClass("action")) {
        username = msg.substr(0, msg.indexOf(" "));
        msg = msg.substr(msg.indexOf(" "));
      }

      var modflair = getRankFromColor(Array.prototype.slice.call(obj.children()[1].classList).filter(function (e) { return e.startsWith("userlist_"); })[0]);

      return {
        username: username,
        msg: msg,
        meta: {
          action: $(obj.children().last()).hasClass("action"),
          modflair: modflair,
          addClass: $(obj.children().last()).attr("class"),
          addClassToNameAndTimestamp: $(obj.children()[0]).attr("class").indexOf($(obj.children()[2]).attr("class")) !== -1
        },
        time: time.getTime()
      }
    }
    var lastmsg = { name: "" };
    $.each($('#messagebuffer').children(), function (i, elem) {
      var msg = parse_message($(elem));
      if (msg) {
        var aftermsg = process_msg(msg);
        var n = formatChatMessage(aftermsg, lastmsg);
        $(elem).html(n.html());

        elem.className = n[0].className;
        var a = aftermsg.username.replace(/[^\w-]/g, '\\$');
        elem.classList.add('chat-msg-' + a);

        $(elem).unbind();
        $(elem).mouseenter(function () {
          $(".chat-msg-" + aftermsg.username).addClass("nick-hover");
        }).mouseleave(function () {
          $(".nick-hover").removeClass("nick-hover");
        });

        if (match_highlight(CLIENT.name, aftermsg)) {
          elem.classList.add('nick-highlight');
        }

        callHandler("chatMsg", aftermsg);

        lastmsg = aftermsg;
      }
    });

    $('#messagebuffer img.channel-emote').each(function (iter, elem) { if ($(elem).prev().hasClass("emote-fallback")) return; var fallback = $('<span class="emote-fallback"/>'); fallback.html($(elem).attr("title")); fallback.insertBefore($(elem)) });
  }
  externalScripts[3].callback.push(process_msgbuffer);

  var add_button = function (id, hint, callback) {
    if ($('#btn_' + id).length) { $('#btn_' + id).unbind().remove(); }

    $("#more-opts").append('<li><a id="btn_' + id + '" href="">' + hint + '</a></li>')

    $('#btn_' + id).click(function (e) {
      var btn = $('#btn_' + id);
      var activated = btn.hasClass("label-success");
      var result = callback(activated);
      if (result === true) {
        btn.addClass("label-success").removeClass("label-default");
      } else if (result === false) {
        btn.addClass("label-default").removeClass("label-success");
      }
      e.preventDefault();
    });
  };

  var add_label = function (id, title, hint, callback) {
    if ($('#lbl_' + id).length) { $('#lbl_' + id).unbind().remove(); }

    $('#modflair').before('<span id="lbl_' + id + '" title="' + hint + '" class="pull-right pointer label-default">' + title + '</span>');

    $('#lbl_' + id).click(function () {
      var btn = $('#lbl_' + id);
      var activated = btn.hasClass("label-success");
      var result = callback(activated);
      if (result === true) {
        btn.addClass("label-success").removeClass("label-default");
      } else if (result === false) {
        btn.addClass("label-default").removeClass("label-success");
      }
    });
  };

  var init_hidePlayer = function () {
    Callbacks.hidePlayer = hidePlayer;
    hidePlayer = function () {
      if (get_option("hidetwitchplayerinmenu") && CUSTOM.mediaType === "tw")
        Callbacks.hidePlayer
    }
  }

  var init_capturelist = function () {
    var CaptureList = function () {
      this.modal = $('#capturelist'),
      this.modal.on('hidden.bs.modal', unhidePlayer),
      this.msglist = document.querySelector('#capturelist #msglist'),
      this.messages = []
    };
    CaptureList.prototype.show = function () {
      hidePlayer();
      this.load();
      this.modal.modal();
    },
    CaptureList.prototype.load = function (e) {
      // Clear Message List
      this.msglist.innerHTML = "";

      this.messages.forEach(function (msg) {
        msg = process_msg(msg);

        var elem = formatChatMessage(msg, { name: "" });

        $(elem).addClass('capture-msg-' + msg.username);

        $(elem).mouseover(function () {
          $('.capture-msg-' + msg.username).addClass('capture-nick-hover')
        });
        $(elem).mouseleave(function () {
          $('.capture-nick-hover').removeClass('capture-nick-hover')
        });

        $(elem).appendTo($(this.msglist));
      });
    }

    $("#capturelist").unbind().remove();
    $("#emotelist").after('<div style="display: none;" id="capturelist" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade"><div class="modal-dialog modal-dialog-fluid"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" aria-hidden="true" class="close">×</button><h4>Capture List</h4></div><div class="modal-body"><div id="msglist" class="linewrap"></div></div><div class="modal-footer"></div></div></div></div>');

    var CAPTURELIST = new CaptureList;

    registerHandler("chatMsg", function (data) {
      if (match_highlight(CLIENT.name, data)) {
        CAPTURELIST.messages.push(data);
      }
    });

    add_button("capture_list", "C", "Show all messages that pinged you", function () {
      CAPTURELIST.show();
      return false;
    });
  }

  var update_clock = function () {
    if (typeof (moment) !== "undefined") {
      var time = $("#btn_clock #clock_time");
      time.html(moment().utc().format(get_option("timeformat")));
    } else {
      setTimeout(update_clock, 1000);
    }
  }

  var init_clock = function () {
    add_button("clock", "", "", function () { return false; });
    $('#btn_clock').html("<span id='clock_time'>0:00</span> GMT");

    update_clock();

    runEveryMinute(update_clock);
  }

  var init_tabcomplete = function () {
    var CUSTOM_emote_cached_last_val = "";
    var CUSTOM_emote_cached_user_val = "";
    var CUSTOM_emote_index = 0;

    var CUSTOM_user_cached_last_val = "";
    var CUSTOM_user_cached_user_val = "";
    var CUSTOM_user_index = 0;

    var chatTabComplete = function (elem, reverse) {
      /*
       * The following code is a repurposed version of the original chatTabComplete, hardly any innovation here
       */

      var uselast = CUSTOM_user_cached_last_val === elem.val();

      if (!uselast) {
        CUSTOM_user_cached_user_val = elem.val();
      }

      var words = CUSTOM_user_cached_user_val.split(" ");
      var current = words[words.length - 1].toLowerCase();
      if (!current.match(/^[\w-]{1,20}$/))
        return;

      var raw_names = Array.prototype.slice.call(document.querySelectorAll("#userlist > .userlist_item")).map(function (e) {
        return e.children[1].innerHTML;
      });
      var names = Array.prototype.slice.call(raw_names).filter(function (user) {
        return user.toLowerCase().indexOf(current) === 0;
      });

      if (names.length === 0) {
        return;
      }

      if (uselast) {
        var offset = reverse ? -1 : 1;
        CUSTOM_user_index = Math.modulo(CUSTOM_user_index + offset, names.length);
        current = names[CUSTOM_user_index];
      } else {
        CUSTOM_user_index = 0;
        current = names[0];
      }

      if (words.length == 1)
        current = current + ": ";
      else
        current = current + " ";

      words[words.length - 1] = current;

      elem.val(words.join(" "));

      CUSTOM_user_cached_last_val = elem.val();
    }

    var emoteTabComplete = function (elem, reverse) {
      /*
       * The following code is a repurposed version of the original chatTabComplete, hardly any innovation here
       */

      var uselast = CUSTOM_emote_cached_last_val === elem.val();

      if (!uselast) {
        CUSTOM_emote_cached_user_val = elem.val();
      }

      var words = CUSTOM_emote_cached_user_val.split(" ");
      var current = words[words.length - 1].toLowerCase();
      if (!current.match(/^\/[\w-]*$/))
        return;

      var emote_name_array = Array.prototype.slice.call(CHANNEL.emotes).map(function (elem) { return elem.name });
      var emotes = Array.prototype.slice.call(emote_name_array).map(function (emote_name) {
        return emote_name.toLowerCase();
      }).filter(function (emote) {
        return emote.indexOf(current) === 0;
      });

      if (emotes.length === 0) {
        return;
      }

      if (uselast) {
        var offset = reverse ? -1 : 1;
        CUSTOM_emote_index = Math.modulo(CUSTOM_emote_index + offset, emotes.length);
        current = emotes[CUSTOM_emote_index];
      } else {
        CUSTOM_emote_index = 0;
        current = emotes[0];
      }

      words[words.length - 1] = current + " ";

      elem.val(words.join(" "));

      CUSTOM_emote_cached_last_val = elem.val();
    }

    var tabComplete = function (event, field) {
      var original = field.val();
      chatTabComplete(field, event.shiftKey);
      var after = field.val();
      if (original === after) {
        emoteTabComplete(field, event.shiftKey);
      }
    }

    $('#chatline').unbind("keydown");
    $('#chatline').keydown(function (e) {
      switch (e.keyCode) {
        case 9:
          tabComplete(e, $('#chatline'));
          e.preventDefault();
          return false;
        case 38:
          if (CHATHISTIDX == CHATHIST.length) {
            CHATHIST.push($('#chatline').val())
          }
          if (CHATHISTIDX > 0) {
            CHATHISTIDX-- , $('#chatline').val(CHATHIST[CHATHISTIDX])
          }
          e.preventDefault();
          return false;
        case 40:
          if (CHATHISTIDX < CHATHIST.length - 1) {
            CHATHISTIDX++;
            $('#chatline').val(CHATHIST[CHATHISTIDX]);
          }
          e.preventDefault();
          return false;
        case 13:
          if (!CHATTHROTTLE) {
            var t = $('#chatline').val();
            if (t.trim()) {
              var a = {
              };
              USEROPTS.adminhat && CLIENT.rank >= 255 ? t = '/a ' + t : USEROPTS.modhat && CLIENT.rank >= Rank.Moderator && (a.modflair = CLIENT.rank),
              CLIENT.rank >= 2 && 0 === t.indexOf('/m ') && (a.modflair = CLIENT.rank, t = t.substring(3));
              if (get_option("unfilter")) t = t.replace("what","wh﻿at").replace("jarjar","jar﻿jar");
              socket.emit('chatMsg', {
                msg: t,
                meta: a
              }),
              CHATHIST.push($('#chatline').val()),
              CHATHISTIDX = CHATHIST.length,
              $('#chatline').val('')
            }
          }
          return undefined;
        default:
          return void 0;
      }
    })

    var find_pm_window = function (username) {
      var pm_window = $('#pm-' + username);
      if (pm_window.length > 0) {
        return pm_window;
      }
    };

    if (!CUSTOM.init_done) {
      Callbacks.initPm = initPm;
      initPm = function (nick) {
        var pre_window = find_pm_window(nick);
        var pm_window = Callbacks.initPm(nick);
        if (!pre_window) {
          pm_window.find('.pm-input').keydown(function (ev) {
            if (ev.keyCode == 9) {
              tabComplete(ev, $(pm_window.find('.pm-input')[0]));
              ev.preventDefault();
              return false;
            }
          });
        }
        return pm_window;
      };
    }
  }

  var render_difftime = function (time) {
    var calc_difftime = function (diff) {
      diff /= 1000;
      var eras = [86400, 3600, 60];
      var times = [];
      eras.forEach(function (era) {
        times.push(Math.floor(diff / era));
        diff = diff % era;
      });
      return times;
    }

    var times = ["d", "h", "min", "s"];
    var diff = time - new Date().getTime();
    var difftime = calc_difftime(diff);

    return difftime.map(function (val, index) {
      if (val === 0) return "";
      return val + times[index];
    }).reduce(function (a, b) {
      if (a === "") return b;
      if (b === "") return a;
      return a + ", " + b
    });
  }

  var render_nicetime = function (time) {
    var now = moment();
    var distance = moment(time).unix() - now.unix();
    var weekdistance = moment(time).week() - now.week();
    if (distance < 60) {
      return "Now"
    } else if (weekdistance === 0) {
      return moment(time).calendar();
    } else {
      return moment(time).format(get_option("dateformat") + " " + get_option("timeformat"))
    }
  }

  var render_time = function (time) {
    return render_nicetime(time) + " | " + render_difftime(time);
  }

  var init_schedulelist = function () {
    var Schedule = function () {
      this.modal = $('#schedulelist'),
      this.modal.on('hidden.bs.modal', unhidePlayer),
      this.table = document.querySelector('#schedulelist tbody')
    };
    Schedule.prototype.show = function () {
      hidePlayer();
      this.load();
      this.modal.modal();
      runEveryMinute(function (timer) {
        if (!this.modal || !this.modal.hasClass("in")) {
          clearInterval(timer);
        } else {
          this.load();
        }
      });
    },
    Schedule.prototype.load = function (e) {
      var time = new Date().getTime();

      var is_in_future = function (e) {
        return time < e[1];
      }

      var render_event = function (data) {
        var event = {
          title: data[0],
          time: data[1],
          region: data[2]
        };
        return '<tr><td class="vertical-middle">' + event.title + '</td><td class="vertical-middle">' + (event.region || "") + '</td><td class="text-left vertical-middle">' + render_nicetime(event.time) + '</td><td class="text-left vertical-middle">' + render_difftime(event.time) + '</td></tr>';
      }

      this.table.innerHTML = CUSTOM.resources.schedule.data.filter(is_in_future).map(render_event).reduce(function (a, b) { return a + b; }, "");
    }

    $("#schedulelist").unbind().remove();
    $("#emotelist").after('<div style="display: none;" id="schedulelist" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade"><div class="modal-dialog modal-dialog-fluid"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" aria-hidden="true" class="close">×</button><h4>Schedule</h4></div><div class="modal-body"><table class="table table-striped table-condensed"><thead><tr><th>Event</th><th>Region</th><th>Time</th><th>Countdown</th></tr></thead><tbody></table></div><div class="modal-footer"></div></div></div></div>');

    return new Schedule;
  }

  var init_rulelist = function () {
    var RuleList = function () {
      this.modal = $('#rulelist'),
      this.modal.on('hidden.bs.modal', unhidePlayer),
      this.ruletable = document.querySelector('#ruletable tbody')
    };
    RuleList.prototype.show = function () {
      hidePlayer();
      this.load();
      this.modal.modal();
    },
    RuleList.prototype.load = function (e) {
      var render_rule = function (rule, num) {
        return '<tr class="text-right"><td class="vertical-middle">' + num + '</td><td class="text-left vertical-middle">' + rule + '</td></tr>';
      }

      this.ruletable.innerHTML = $.map(CUSTOM.resources.rules.data, render_rule).reduce(function (a, b) { return a + b; });
    }

    $("#rulelist").unbind().remove();
    $("#emotelist").after('<div style="display: none;" id="rulelist" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade"><div class="modal-dialog modal-dialog-fluid"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" aria-hidden="true" class="close">×</button><h4>Rule List</h4></div><div class="modal-body"><table id="ruletable" class="table table-striped table-condensed"><thead><tr><th id="rule-id" class="text-right">No.</th><th>Rule</th></tr></thead><tbody></table></div><div class="modal-footer"></div></div></div></div>');

    return new RuleList;
  }

  var init_settings = function () {
    var Settings = function () {
      this.modal = $('#customsettings');
      this.modal.on('hidden.bs.modal', unhidePlayer);
      this.table = $('#customsettings tbody');
    };
    Settings.prototype.show = function () {
      hidePlayer();
      this.load();
      this.modal.modal();
    },
    Settings.prototype.load = function () {
      var render_toggle = function (name, data) {
        var elem = $('<div/>')
        var toggle = $('<input type="checkbox"/>');
        toggle.attr("id", "custom-setting-" + name);
        toggle.change(function () {
          var enabled = $(this).prop("checked");
          set_option(name, enabled);
        });

        toggle[0].checked = get_option(name);

        toggle.appendTo(elem);
        return elem;
      }

      var render_selector = function (name, data) {
        var elem = $('<div/>')
        var select = $('<select class="form-control"/>');
        data.values.forEach(function (e, index) {
          var opt = $("<option/>");
          opt.text(data.names[index]);
          opt.attr("value", data.values[index]);
          opt.appendTo(select);
        });
        select.change(function () {
          var value = $(this).val();
          set_option(name, value);
        });
        select.val(get_option(name));

        select.appendTo(elem);
        return elem;
      }

      var render_option = function (name, data) {
        switch (data.type) {
          case "toggle": return render_toggle(name, data);
          case "selector": return render_selector(name, data);
          case "none": return null;
          default: return $('<span class="error">An error has occured</span>');
        }
      }

      var render_opt = function (name, data) {
        var tr = $('<tr class="text-left"/>');
        var label = $('<td class="text-left vertical-middle">');
        label.text(data.displayname);
        label.appendTo(tr);
        var input = $('<td class="text-left vertical-middle">');
        var rendered = render_option(name, data);
        if (rendered) {
          rendered.appendTo(input);
          input.appendTo(tr);
          return tr;
        } else {
          return null;
        }
      }

      var render_line = function (name, data) {
        var line = render_opt(name, data);
        if (line) $('#customsettings tbody').append(line);
      }

      $('#customsettings tbody').unbind().html("");
      $.each(Options, render_line);
    }

    $("#customsettings").unbind().remove();
    $("#emotelist").after('<div style="display: none;" id="customsettings" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade"><div class="modal-dialog modal-dialog-fluid"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" aria-hidden="true" class="close">×</button><h4>Settings</h4></div><div class="modal-body"><table class="table table-striped table-condensed"><tbody id="customsettingstable"></tbody></table></div><div class="modal-footer"></div></div></div></div>');

    return new Settings;
  }

  var renderScheduleButton = function () {
    if (typeof (moment) === "undefined" || CUSTOM.resources.schedule.data === null) return;

    var apply = function (text) {
      $("#btn_schedule").html(text);
      $("#schedulebtn").html(text);
    }

    var time = new Date().getTime();
    var events = CUSTOM.resources.schedule.data.filter(function (e) {
      return time < e[1];
    });

    if (events.length === 0) {
      apply("Nothing scheduled")
    } else {
      var event = events[0];
      if (!event) {
        console.error("An error occured: There are more than 0 events, but no event could be found");
        console.dir(events);
      }

      var region = event.length === 3 ? (" [" + event[2] + "]") : "";
      var divider = CUSTOM.shortSchedule ? "<br>" : " | ";
      apply(event[0] + region + divider + render_time(event[1]));
    }
  };
  CUSTOM.resources.schedule.callback.push(renderScheduleButton);
  externalScripts[1].callback.push(renderScheduleButton);

  var init_controls = function () {
    var ruleList = init_rulelist();
    var schedule = init_schedulelist();
    var settings = init_settings();

    $('#customcontrols').unbind().remove();
    $('#emotelistbtn').unbind().remove();
    $("#leftcontrols").prepend('<div id="customcontrols" class="btn-group"/>');

    $("#more-opts").unbind().remove();
    $("#chatheader").append('<ul id="more-opts" class="dropdown-menu"></ul>');
    $("#more-opts").hide();

    $('#customcontrols').prepend('<button id="schedulebtn" title="Schedule" class="btn btn-sm btn-default">Nothing scheduled</button>').button();
    $('#customcontrols').prepend('<button id="settingsbtn" title="Settings" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-list"></span>&nbsp;</button>').button();
    $('#customcontrols').prepend('<button id="ruleslistbtn" title="Rules List" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-tower"></span>&nbsp;</button>').button();
    $('#customcontrols').prepend('<button id="lyricsbtn" title="Lyrics" class="btn btn-sm btn-default" data-toggle="dropdown"><span class="glyphicon glyphicon-book"></span></button>').button();
    $('#customcontrols').prepend('<button id="emotelistbtn" title="Emote List" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-picture"></span>&nbsp;</button>').button();

    $("#schedulebtn").click(function () {
      schedule.show();
    });
    add_button("schedule", "Schedule", function () {
      schedule.show();
      return false;
    });
    $("#btn_schedule").hide();

    $("#settingsbtn").click(function () {
      settings.show();
    });
    add_button("settings", "Appearance Settings", function () {
      settings.show();
      return false;
    });
    $("#btn_settings").hide();

    $("#ruleslistbtn").click(function () {
      ruleList.show();
    });
    add_button("ruleslist", "Rules", function () {
      ruleList.show();
      return false;
    });
    $("#btn_ruleslist").hide();

    $("#emotelistbtn").click(function () {
      EMOTELIST.show();
    });

    renderScheduleButton();
    runEveryMinute(renderScheduleButton);
  }

  var render_awards = function () {
    $(".userlist_item").each(function (key, val) {
      if (CUSTOM.resources.awards.data && CUSTOM.resources.awards.data[$(val).data("name")]) $(val).addClass("award_" + CUSTOM.resources.awards.data[$(val).data("name")]);
    });
  }
  CUSTOM.resources.awards.callback.push(render_awards);

  var colorize_nick = function (str, max, min) {
    var hash = Math.modulo(str.hash(), 360);
    return "hsl(" + hash + ", 84%, 67%)";
  };

  var colorize_userlist_item = function (elem) {
    var color = colorize_nick(elem.data("name") + ": ");
    var style = elem.children()[1].style;
    if (elem.data("rank") < 2) style.setProperty("color", color);
    elem.attr("data-rank", elem.data("rank"));
  }

  var colorize_userlist = function () {
    $(".userlist_item").each(function (key, val) {
      colorize_userlist_item($(val));
    });
  }

  var init_lyrics = function () {
    var render_submenu = function (data) {
      var menu = $('<li class="dropdown-submenu"><a tabindex="-1" href="#">' + data.title + '</a><ul class="dropdown-menu"></ul></li>')
      var container = menu.find(".dropdown-menu");
      data.children.forEach(function (val) {
        render_elem(val).appendTo(container);
      });
      return menu;
    }

    var render_entry = function (data) {
      return $('<li><a data-song="' + data.url + '" href="#">' + data.title + '</a></li>')
    }

    var render_divider = function (data) {
      return $('<li class="divider"></li>');
    }

    var render_elem = function (data) {
      if (data.type === "menu") return render_submenu(data);
      else if (data.type === "song") return render_entry(data);
      else if (data.type === "container") return render_container(data);
      else if (data.type === "divider") return render_divider(data);
      else return $('<li><a>An error occured</a></li>');
    }

    var render_container = function (data) {
      var container = $('<ul id="lyrics_menu" class="dropdown-menu" role="menu"></ul>');
      data.children.forEach(function (val) {
        render_elem(val).appendTo(container);
      });
      return container;
    }

    $('#lyrics_menu').unbind().remove();
    $('#lyricsbtn').after(render_elem(CUSTOM.resources.lyrics.data));

    $('#lyrics_menu a').click(function (e) {
      var song = $(this).attr("data-song");
      if (song && song !== "") {
        $.ajax({
          url: path + 'lyrics/' + song,
          crossDomain: true,
          success: function (data) {
            var div = $('<div/>');
            $('#pollwrap').prepend(div);
            div.html("<button class=\"close pull-right\">×</button>" + data + "<button class=\"close pull-right\">×</button>");
            div.addClass('text-center well lyrics');
            div.find('button').click(function () { div.remove(); });
          }
        });
      }

      e.preventDefault();
    });
  }
  CUSTOM.resources.lyrics.callback.push(init_lyrics);

  var init_options = function () {
    try {
      var parsed = JSON.parse(localStorage.getItem("yepityha-custom-options"));
      if (parsed) CustomOptions = parsed;
    } catch (e) { }
    $.each(Options, function (name, data) {
      if (!CustomOptions.hasOwnProperty(name)) {
        console.debug("Initializing option " + name + " with default value " + data.default);
        console.trace();
        CustomOptions[name] = data.default;
      }
    });
    apply_options();
  }

  var apply_options = function () {
    set_body_class("newchat", get_option("newchat"));
    set_body_class("chatcolors", get_option("chatcolors"));
    set_body_class("thinnames", get_option("thinnames"));
    set_body_class("emote_disable", get_option("emote_disable"));
    set_body_class("intro_disable", get_option("intro_disable"));
    set_body_class("hideafkicons", get_option("hideafkicons"));
    set_body_class("large-chat", get_option("large-chat"));
    display_button("emote-disable", get_option("emote_disable"));
    apply_hidden_video(get_option("hide-video"));
    handleWindowResize();
    if (typeof (moment) !== "undefined") {
      var lang;

      if ("auto" === get_option("language")) lang = navigator.language;
      else lang = get_option("language");

      lang = moment.locale(lang);

      if (lang === "en") lang = "en-au";
      moment.copyLocale(lang);

      moment.locale("custom");
      moment.localeData()._longDateFormat = JSON.parse(JSON.stringify(moment.localeData()._longDateFormat));
      if (get_option("dateformat") !== "L") moment.localeData()._longDateFormat.L = get_option("dateformat");
      if (get_option("timeformat") !== "LT") moment.localeData()._longDateFormat.LT = get_option("timeformat");
    }
    renderScheduleButton();
    update_clock();
  }
  externalScripts[1].callback.push(apply_options);

  var elem_to_user = function (i, el) {
    var elem = $(el);
    return {
      meta: elem.data("meta"),
      name: elem.data("name"),
      profile: elem.data("profile"),
      rank: elem.data("rank")
    }
  }

  var get_users = function () {
    return Array.prototype.slice.call($("#userlist > .userlist_item").map(elem_to_user));
  }

  var get_left = function (new_userlist) {
    return get_users().filter(function (e) { return new_userlist.map(function (e) { return e.name }).indexOf(e.name) === -1 })
  }

  var get_joined = function (new_userlist) {
    return get_users().filter(function (e) { return new_userlist.map(function (e) { return e.name }).indexOf(e.name) !== -1 })
  }

  var init_callbacks = function () {
    registerCallback("connect", function (event, original) {
      original(event);
      init();
    })

    registerCallback("setMotd", function (e, original) {
      original(e);
      loadData();
    });

    registerCallback("userlist", function (event, original) {
      var handler = function () {
        get_left().forEach(Callbacks.userLeave);
        get_joined().forEach(Callbacks.addUser);
        renderStars();
      };
      if (CUSTOM.resources.stars.data === null) {
        CUSTOM.resources.stars.callback.push(handler);
        loadData();
      } else {
        handler();
      }
    })

    registerCallback("addUser", function (e, original) {
      var is_new = !findUserlistItem(e.name);
      original(e);
      if (is_new) addChatMessage(getIntroFromName(e.name, 1));
      colorize_userlist_item(findUserlistItem(e.name))
      renderStars();
    });

    registerCallback("userLeave", function (e, original) {
      original(e);
      addChatMessage(getIntroFromName(e.name, -1));
      renderStars();
    });

    registerCallback("chatMsg", function (data, original) {
      original(process_msg(data));
      if (data.msg.indexOf("$star") === 0 || data.msg.indexOf("$setstar") === 0) {
        loadData();
      }
    });

    registerCallback("pm", function (data, original) {
      original(process_msg(data));
      if (data.msg.indexOf("$star") === 0 || data.msg.indexOf("$setstar") === 0) {
        loadData();
      }
    });
  }

  var init_chatsizer = function () {
    if ($("body").hasClass("synchtube") && $("body").hasClass("fluid")) {
      add_button("large-chat", "Large Chat", function (enabled) {
        set_option("large-chat", !enabled);
        apply_options();
        return !enabled;
      });
    }
    add_label("more-settings", "...", "More", function (enabled) {
      if (enabled) $("#more-opts").hide();
      else $("#more-opts").show();
      return !enabled;
    });
    add_button("hide-video", "Remove Video", function (enabled) {
      set_option("hide-video", !enabled);
      apply_options();
      return !enabled;
    });
    add_button("emote-disable", "Disable Emotes", function (enabled) {
      set_option("emote_disable", !enabled);
      apply_options();
      return !enabled;
    });
  }

  var init_better_player = function () {
    TwitchPlayer.prototype.load = function (e) {
      e.meta.embed = {
        src: '//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf',
        tag: 'object',
        params: {
          flashvars: 'embed=1&hostname=localhost&channel=' + e.id + '& eventsCallback=twitchEventCallback&auto_play=true&start_volume=' + Math.floor(100 * VOLUME)
        }
      };
      if (get_option("transparentplayer")) e.meta.embed.params.wmode = "transparent";
      return TwitchPlayer.__super__.load.call(this, e)
    }

    if (!CUSTOM.mediaType || CUSTOM.mediaType === "tw") {
      PLAYER.mediaType = "";
      PLAYER.mediaId = "";
      socket.emit("playerReady");
    }
  }

  var init = function () {
    loadData();
    init_options();
    init_clock();
    init_capturelist();
    init_tabcomplete();
    init_controls();
    init_chatsizer();
  }

  var init_once = function () {
    init_overloads();
    init();
    loadExternal();
    process_msgbuffer();
    colorize_userlist();
    init_callbacks();
    init_timeDisplay();
    init_hidePlayer();
    init_better_player();

    CUSTOM.init_done = true;
  }

  if (CUSTOM.init_done === false) {
    console.info("Initializing for first time");
    init_once();
  } else {
    console.info("Already initialized, skipping initializing");
    init();
  }
})();