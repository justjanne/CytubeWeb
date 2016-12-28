/* global CUSTOM */
/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="typings/cytube/cytube.d.ts"/>
/// <reference path="typings/katex/katex.d.ts"/>
/// <reference path="typings/moment/moment.d.ts"/>

var global_autocomplete_last_index = 0;
var global_autocomplete_original_query = "";
var global_autocomplete_last_result = "";
var global_autocomplete_last_suffix = "";
var global_autocomplete_last_caret = 0;

if ("undefined" === typeof (CUSTOM)) CUSTOM = {
  chatcolor: null,
  init_done: false,
  chat_only: false,
  resources: null,
  media_type: null,
  userstats: {},
  index: [],
  volume: 0,
  hidden: false,
  shortSchedule: false,
  mobile: (720 >= window.innerWidth && 720 >= window.innerHeight),
  debug: false
};

(function () {
  var path;
  // Store original Cytube callbacks
  var OriginalCallbacks = {};
  // Store even handlers
  var Handlers = {};
  var CustomOptions = {};

  if ("http:" === window.location.protocol) {
    window.location.href = window.location.href.replace("http://", "https://")
  }

  if ("#debug" === window.location.hash) {
    path = "https://localhost.kuschku.de/";
    CUSTOM.debug = true;
  } else if ("#old" === window.location.hash) {
    path = "https://cdn.kuschku.de/"
  } else {
    path = "https://cdn.kuschku.de/beta/"
  }

  var logfn = function () {
    //if (CUSTOM.debug) console.log("%o %s",logfn.caller,
    // JSON.stringify(Array.prototype.slice.call(logfn.caller.arguments)));
  };

  var Options = {
    "newchat": {
      "displayname": "New Chat Layout (beta)",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "chatcolors": {
      "displayname": "Colored Usernames",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "thinnames": {
      "displayname": "Thin Usernames",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "emote_disable": {
      "displayname": "Disable Emotes and Embeds",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "intro_disable": {
      "displayname": "Hide Join/Leave Messages",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "smarttabcomplete": {
      "displayname": "Smart TabComplete",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": true
    }, "hideafkicons": {
      "displayname": "Hide AFK icons",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "integrated_profile": {
      "displayname": "Integrate Userprofile with Dropdown",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "visited_links": {
      "displayname": "Mark Videos in the Schedule that you’ve already seen with a checkmark",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "snow": {
      "displayname": "Show Snow", "type": "toggle", "names": ["", ""], "values": [false, true], "default": false
    }, "banner": {
      "displayname": "Show Banner", "type": "toggle", "names": ["", ""], "values": [false, true], "default": false
    }, "pmbar_unfocus": {
      "displayname": "Hide PM windows without new PMs when typing in chatbar",
      "type": "toggle",
      "names": ["", ""],
      "values": [false, true],
      "default": false
    }, "dateformat": {
      "displayname": "Preferred Date Format",
      "type": "selector",
      "names": ["2015-12-31", "12/31/2015", "31.12.2015", "Automatic"],
      "values": ["YYYY-MM-DD", "MM/DD/YYYY", "DD.MM.YYYY", "L"],
      "default": "L"
    }, "timeformat": {
      "displayname": "Preferred Time Format",
      "type": "selector",
      "names": ["16:02", "4:02 PM", "Automatic"],
      "values": ["H:mm", "h:mm A", "LT"],
      "default": "LT"
    }, "language": {
      "displayname": "Language",
      "type": "selector",
      "names": ["Automatic", "English", "Afrikaans", "Arabic (Morocco)", "Arabic (Saudi Arabia)", "Arabic (Tunisia)", "Arabic", "Azeri (Latin)", "Belarusian", "Bulgarian", "Catalan", "Czech", "Welsh", "Danish", "German (Austria)", "German", "Greek", "English (Australia)", "English (Canada)", "English (United Kingdom)", "Esperanto", "Spanish", "Estonian", "Basque", "Farsi", "Finnish", "Faroese", "French (Canada)", "French", "Galician", "Hebrew", "Hindi", "Croatian", "Hungarian", "Armenian (Armenia)", "Indonesian", "Icelandic", "Italian", "Japanese", "Georgian", "Korean", "Lithuanian", "Latvian", "FYRO Macedonian", "Marathi", "Malay (Malaysia)", "Malay", "Norwegian (Bokmål)", "Dutch", "Polish", "Portuguese (Brazil)", "Portuguese", "Romanian", "Russian", "Slovak", "Slovenian", "Albanian", "Swedish", "Tamil", "Thai", "Tagalog (Philippines)", "Turkish", "Ukrainian", "Uzbek (Latin)", "Vietnamese", "Chinese (China)", "Chinese (Taiwan)"],
      "values": ["auto", "en", "af", "ar-ma", "ar-sa", "ar-tn", "ar", "az", "be", "bg", "ca", "cs", "cy", "da", "de-at", "de", "el", "en-au", "en-ca", "en-gb", "eo", "es", "et", "eu", "fa", "fi", "fo", "fr-ca", "fr", "gl", "he", "hi", "hr", "hu", "hy-am", "id", "is", "it", "ja", "ka", "ko", "lt", "lv", "mk", "mr", "ms-my", "my", "nb", "nl", "pl", "pt-br", "pt", "ro", "ru", "sk", "sl", "sq", "sv", "ta", "th", "tl-ph", "tr", "uk", "uz", "vi", "zh-cn", "zh-tw"],
      "default": "auto"
    }, "large-chat": {
      "displayname": "Large Chat", "type": "none", "default": false
    }, "hide-video": {
      "displayname": "Hide Video", "type": "none", "default": false
    }
  };

  // Ressources
  if (null === CUSTOM.resources) {
    CUSTOM.resources = {
      "stars": {
        "url": path + "data/stars.php", "callback": [], "data": null,
      }, "awards": {
        "url": path + "data/awards.json", "callback": [], "data": null,
      }, "rules": {
        "url": path + "data/rules.json", "callback": [], "data": null,
      }, "lyrics": {
        "url": path + "data/lyrics.json", "callback": [], "data": null,
      }, "intro": {
        "url": path + "data/intro.json", "callback": [], "data": null,
      }, "emotestats": {
        "url": path + "data/emotestats.json", "callback": [], "data": {},
      }, "ranks": {
        "url": "motd://ranks", "callback": [], "data": null
      }, "schedule": {
        "url": "motd://schedule", "callback": [], "data": null,
      }, "permissions": {
        "url": "motd://permissions", "callback": [], "data": null,
      }
    };
  }

  var externalScripts = [{
    "type": "css", "url": path + "custom.css", "callback": []
  }, {
    "type": "js", "url": path + "moment.js", "callback": []
  }, {
    "type": "css", "url": path + "katex.min.css", "callback": []
  }, {
    "type": "js", "url": path + "katex.min.js", "callback": []
  }, {
    "type": "js", "url": path + "caret.min.js", "callback": []
  }];

  var runEveryMinute = function (callback) {
    logfn();

    setTimeout(function () {
      setTimeout(function () {
        var x = setInterval(function () {
          callback(x);
        }, 60000);
      }, 60000 - 1000 * new Date().getUTCSeconds());
    }, 1000 - new Date().getUTCMilliseconds());
  };

  var runEverySecond = function (callback) {
    logfn();

    setTimeout(function () {
      var x = setInterval(function () {
        callback(x);
      }, 1000);
    }, 1000 - new Date().getUTCMilliseconds());
  };

  var callHandler = function (name, arg) {
    logfn();

    if (Handlers[name] === undefined) {
      Handlers[name] = [];
    }
    Handlers[name].forEach(function (func) {
      func(arg);
    });
  };

  var registerHandler = function (name, func) {
    logfn();

    if (Handlers[name] === undefined) {
      Handlers[name] = [];
    }
    Handlers[name].push(func);
  };

  var unregisterHandler = function (name, func) {
    logfn();

    if (Handlers[name] === undefined) {
      Handlers[name] = [];
    }
    Handlers[name] = Handlers[name].filter(function (el) {
      return el !== func
    });
  };

  var registerCallback = function (name, func) {
    logfn();

    if (!OriginalCallbacks.hasOwnProperty(name)) {
      OriginalCallbacks[name] = Callbacks[name];
      Callbacks[name] = function (e) {
        if (CUSTOM.debug) {
          console.debug(name);
        }
        if (CUSTOM.debug) {
          console.debug(JSON.parse(JSON.stringify(e)));
        }
        func(e, OriginalCallbacks[name]);
        callHandler(name, e);
      }
    }
  };

  var set_body_class = function (name, enable) {
    logfn();

    if (enable) {
      document.body.classList.add(name);
    } else {
      document.body.classList.remove(name);
    }
  };

  var display_button = function (id, enable) {
    logfn();

    if (enable) {
      $('#btn_' + id).addClass("label-success").removeClass("label-default");
    } else {
      $('#btn_' + id).addClass("label-default").removeClass("label-success");
    }
  };

  var set_option = function (name, value) {
    logfn();

    CustomOptions[name] = value;
    store_options();
    apply_options();
  };

  var get_option = function (name) {
    logfn();

    if (!CustomOptions.hasOwnProperty(name) && Options.hasOwnProperty(name)) {
      set_option(name, Options[name].default);
      console.log("Initializing option " + name + " with default value " + Options[name].default);
      console.trace();
    }
    return CustomOptions[name];
  };

  var store_options = function () {
    logfn();

    localStorage.setItem(CHANNEL.name + "-custom-options", JSON.stringify(CustomOptions));
  };

  var init_overloads = function () {
    logfn();

    if ('function' != typeof Math.modulo) {
      Math.modulo = function (a, b) {
        var x = (a % b);
        if (0 > x) {
          return x + b;
        } else {
          return x;
        }
      }
    }

    if ('function' != typeof String.prototype.startsWith) {
      String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
      };
    }

    if ('function' != typeof String.prototype.endsWith) {
      String.prototype.endsWith = function (str) {
        return this.slice(-str.length) == str;
      };
    }

    if ('function' != typeof String.prototype.hash) {
      String.prototype.hash = function () {
        return this.split("").map(function (a) {
          return a.charCodeAt(0);
        }).reduce(function (a, b) {
          return ((b << 5) - b) + a;
        });
      }
    }

    if ('function' != typeof String.prototype.contains) {
      String.prototype.contains = function (text) {
        return this.indexOf(text) !== -1;
      }
    }

    if ('function' != typeof escape_html) {
      escape_html = function (str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
    }

    if ('function' != typeof check_for_unsecure_content) {
      check_for_unsecure_content = function (str) {
        if (str.contains("http://")) {
          console.err("Warning: Message might contain insecure content: " + str);
        }
      }
    }
  };

  var hideVideo = function () {
    logfn();

    $('#chatwrap').removeClass('col-lg-5 col-md-5').addClass('col-md-12');
    $('#videowrap').hide();
    PLAYER.getVolume(function (vol) {
      CUSTOM.volume = vol;
      PLAYER.setVolume(0);
    });
    CUSTOM.hidden = true;
  };

  var unhideVideo = function () {
    logfn();

    $('#videowrap').show();
    $('#chatwrap').addClass('col-lg-5 col-md-5').removeClass('col-md-12');
    PLAYER.setVolume(CUSTOM.volume);
    CUSTOM.hidden = false;
  };

  var apply_hidden_video = function (enabled) {
    logfn();

    if (!CUSTOM.hidden && enabled) {
      hideVideo();
    } else {
      if (CUSTOM.hidden && !enabled) {
        unhideVideo();
      }
    }
  };

  $(window).unbind("resize");
  $(window).resize(function () {
    handleWindowResize();
    CUSTOM.mobile = (720 >= window.innerWidth && 720 >= window.innerHeight);
  });

  formatChatMessage = function (e, t) {
    logfn();

    var internal_formatChatMessage = function (data, config) {
      if (!data.meta || data.msgclass) {
        data.meta = {
          addClass: data.msgclass, addClassToNameAndTimestamp: data.msgclass
        };
      }
      var hideName = data.username === (config.name || config.username);
      if ("server-whisper" === data.meta.addClass || "custom-intro" === data.meta.addClass) {
        hideName = true;
      }
      if (data.msg.match(/^\s*<strong>\w+\s*:\s*<\/strong>\s*/)) {
        hideName = false;
      }
      if (data.meta.forceShowName) {
        hideName = false;
      }
      data.msg = execEmotes(data.msg);
      config.name = data.username;
      var div = $("<div/>");
      if ("drink" === data.meta.addClass) {
        div.addClass("drink");
        data.meta.addClass = "";
      }
      if (USEROPTS.show_timestamps) {
        var time = $("<span/>").addClass("timestamp").appendTo(div);
        var timeStr = (new Date(data.time)).toTimeString().split(" ")[0];
        time.text("[" + timeStr + "] ");
        if (data.meta.addClass && data.meta.addClassToNameAndTimestamp) {
          time.addClass(data.meta.addClass);
        }
      }
      var name = $("<span/>");
      if (!hideName && !data.meta.action) {
        $("<strong/>").addClass("username").text(data.username + ": ").appendTo(name);
        if (data.meta.modflair) {
          name.addClass(getNameColor(data.meta.modflair));
        }
        if (data.meta.addClass && data.meta.addClassToNameAndTimestamp) {
          name.addClass(data.meta.addClass);
        }
        if (data.meta.superadminflair) {
          name.addClass("label").addClass(data.meta.superadminflair.labelclass);
          $("<span/>").addClass(data.meta.superadminflair.icon).addClass("glyphicon").css("margin-right", "3px").prependTo(name);
        }
      }
      name.appendTo(div);
      var result = $("<span/>").appendTo(div);
      if (data.data) {
        $.each(data.data, function (key, url) {
          div.attr("data-" + key, url);
        });
      }
      result[0].innerHTML = check_for_unsecure_content(data.msg);
      if (data.meta.action) {
        name.html("");
        result[0].innerHTML = data.username + " " + data.msg;
      }
      if (data.meta.addClass) {
        result.addClass(data.meta.addClass);
      }
      if (data.meta.shadow) {
        div.addClass("chat-shadow");
      }
      div.find("img").load(function () {
        if (SCROLLCHAT) {
          scrollChat();
        }
      });
      return div;
    };

    var res = internal_formatChatMessage(e, t);
    if (e.data) {
      $.each(e.data, function (key, value) {
        res.attr("data-" + key, value);
      });
    }

    if (2 == res.children().size() && res[0].className.startsWith("chat-msg-") && "intro" !== res.attr("data-type")) {
      $(res.children().get(0)).after('<span></span>');
    }

    if ($(res).find(".username")[0]) {
      $(res).find(".username")[0].style.color = colorize_nick($(res).find(".username")[0].innerHTML);
    }

    return res;
  };

  execEmotes = function (e) {
    logfn();

    CHANNEL.emotes.forEach(function (t) {
      e = e.replace(t.regex, '$1<span class="emote-fallback">' + t.name + '</span><img class="channel-emote" src="' +
        t.image + '" title="' + t.name + '">')
    });
    return e;
  };

  chatOnly = function () {
    logfn();

    var e = $("#chatwrap").detach();
    removeVideo();
    $("#wrap").remove();
    $("footer").remove();
    e.prependTo($("body"));
    e.css({
      "min-height": "100%", "min-width": "100%", margin: "0", padding: "0"
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
      EMOTELISTMODAL.modal();
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
    setVisible("#btn_chan-settings", 2 <= CLIENT.rank);
    $("body").addClass("chatOnly");
    handleWindowResize();

    CUSTOM.chat_only = true;
  };

  var userlist_createProfile = function (elem, userdata) {
    logfn();

    elem.find(".profile-box.linewrap").unbind().remove();

    var profile = $("<div/>").addClass("profile-box linewrap").appendTo(elem);
    if (userdata.profile.image) {
      if (0 !== userdata.profile.image.indexOf("https://") && 0 !== userdata.profile.image.indexOf("://") &&
        userdata.profile.image.indexOf("://") !== -1) {
        userdata.profile.image = "https://i.imgur.com/removed.png";
      }

      $("<img/>").addClass("profile-image").attr("src", userdata.profile.image).appendTo(profile);
    }

    $("<strong/>").text(userdata.name).appendTo(profile);

    if (userdata.meta.ip) {
      $("<br/>").appendTo(profile);
      $("<em/>").text(userdata.meta.ip).appendTo(profile);
    }
    if (userdata.meta.aliases) {
      $("<br/>").appendTo(profile);
      $("<em/>").text("aliases: " + userdata.meta.aliases.join(", ")).appendTo(profile);
    }
    $("<hr/>").css("margin-top", "5px").css("margin-bottom", "5px").appendTo(profile);
    $("<p/>").text(userdata.profile.text).appendTo(profile);

    return profile;
  };

  var userlist_hoverProfile = function (elem, userdata) {
    logfn();

    var alignProfile = function (profile, event) {
      var top = event.clientY + 5;
      var left = event.clientX;
      if ($("body").hasClass("synchtube")) {
        left -= profile.outerWidth();
      }
      profile.css("left", left + "px");
      profile.css("top", top + "px");
    };

    profile_unbind(elem);

    elem.mouseenter(function (event) {
      var oldProfile = findUserlistItem(userdata.name).find(".profile-box.linewrap");
      if (oldProfile) {
        oldProfile.remove();
      }
      alignProfile(userlist_createProfile(elem, userdata), event);
    });
    elem.mousemove(function (event) {
      var profile = findUserlistItem(userdata.name).find(".profile-box.linewrap");
      alignProfile(profile, event);
    });
    elem.mouseleave(function () {
      var profile = findUserlistItem(userdata.name).find(".profile-box.linewrap");
      profile.remove();
    });

    var clk = function (event) {
      if (event.shiftKey) {
        return true;
      }

      var elem = findUserlistItem(userdata.name);
      var dropdown = elem.find(".user-dropdown");

      event.preventDefault();
      if ("none" == dropdown.css("display")) {
        $(".user-dropdown").hide();
        $(document).bind("mouseup.userlist-ddown", function (t) {
          if (0 === dropdown.has(event.target).length && 0 === elem.parent().has(event.target).length) {
            dropdown.hide();
            $(document).unbind("mouseup.userlist-ddown")
          }
        });
        dropdown.show();
        dropdown.css("top", elem.position().top)
      } else {
        dropdown.hide();
      }
      return false;
    };

    elem.click(clk);
    elem.contextmenu(clk);
  };

  var profile_unbind = function (elem) {
    logfn();

    $(elem.children()[1]).unbind("mousemove");
    $(elem.children()[1]).unbind("mouseenter");
    $(elem.children()[1]).unbind("mouseleave");
    elem.unbind("mousemove");
    elem.unbind("mouseenter");
    elem.unbind("mouseleave");
    elem.unbind("contextmenu");
    elem.unbind("click");
  };

  var userlist_dropdownProfile = function (elem, userdata) {
    logfn();

    profile_unbind(elem);

    var clk = function (event) {
      if (event.shiftKey) {
        return true;
      }

      var elem = findUserlistItem(userdata.name);
      var dropdown = elem.find(".user-dropdown");
      var profile = elem.find(".profile-box.linewrap");

      event.preventDefault();
      if ("none" === dropdown.css("display")) {
        $(".user-dropdown").hide();
        $(document).bind("mouseup.userlist-ddown", function (t) {
          if (0 === dropdown.has(event.target).length && 0 === elem.parent().has(event.target).length) {
            dropdown.hide();
            $(document).unbind("mouseup.userlist-ddown")
          }
        });
        $("#userlist").find(".profile-box.linewrap").hide();
        dropdown.show();
        profile.show();
        dropdown.css("top", elem.position().top)
      } else {
        dropdown.hide();
        profile.hide();
      }
      return false;
    };

    var profile = userlist_createProfile(elem, userdata);
    if ("none" === elem.find(".user-dropdown").css("display")) {
      profile.hide();
    }
    elem.click(clk);
    elem.contextmenu(clk);
  };

  var userlist_profile = function (elem, userdata) {
    logfn();

    if (!userdata) {
      userdata = elem_to_user(-1, elem);
    }

    if (get_option("integrated_profile")) {
      userlist_dropdownProfile(elem, userdata);
    } else {
      userlist_hoverProfile(elem, userdata);
    }
  };
  OriginalCallbacks.addUserDropdown = addUserDropdown;
  addUserDropdown = function (elem) {
    OriginalCallbacks.addUserDropdown(elem);
    userlist_profile(elem);
  };

  var userlist_applyProfiles = function () {
    logfn();

    $("#userlist").find(".userlist_item").each(function (i, elem) {
      userlist_profile($(elem));
    });
  };

  formatUserlistItem = function (div) {
    logfn();

    if (0.5 === div.data("rank") % 1 && !div.data("leader")) {
      Callbacks.setLeader(div.data("name"));
    }

    var userdata = elem_to_user(-1, div);

    var name = $(div.children()[1]);
    name.removeClass();
    name.css("font-style", "");
    name.addClass(getNameColor(userdata.rank));
    div.find(".profile-box").remove();

    colorize_userlist_item(div);

    div.toggleClass("userlist_afk", userdata.meta.hasOwnProperty("afk") && userdata.afk);
    div.toggleClass("userlist_muted", userdata.meta.hasOwnProperty("muted") && userdata.meta.muted);
    div.toggleClass("userlist_smuted", userdata.meta.hasOwnProperty("smuted") && userdata.meta.smuted);

    var icons = div.children()[0];
    icons.innerHTML = "";
    if (userdata.leader) {
      $("<span/>").addClass("glyphicon glyphicon-star-empty").appendTo(icons);
    }
    if (userdata.afk) {
      name.css("font-style", "italic");
      $("<span/>").addClass("glyphicon glyphicon-time").appendTo(icons);
    }
    if (userdata.icon) {
      $("<span/>").addClass("glyphicon " + userdata.icon).prependTo(icons);
    }
    if (CUSTOM.resources.stars.data.hasOwnProperty(userdata.name)) {
      div.attr("data-star", CUSTOM.resources.stars.data[userdata.name]);
    } else {
      div.attr("data-star", "0");
    }
    div.attr("data-rank", userdata.rank);
    div.attr("data-name", userdata.name);

    userlist_profile(div, userdata);
  };

  var loadExternal = function () {
    logfn();

    var requestCSS = function (val) {
      var tag = document.createElement("link");
      tag.type = "text/css";
      tag.rel = "stylesheet";
      tag.href = val.url + "?_=" + (new Date().getTime());
      document.head.appendChild(tag);
      $(tag).ready(function () {
        val.callback.forEach(function (f) {
          f();
        });
      });
    };

    externalScripts.forEach(function (val) {
      if ("css" === val.type) {
        requestCSS(val);
      } else {
        if ("js" === val.type) {
          $.getScript(val.url).done(function () {
            val.callback.forEach(function (f) {
              f();
            })
          });
        }
      }
    });
  };

  // Load ressource from motd
  var extractFromMotd = function (url, callback) {
    logfn();

    var cleanurl = url.substr("motd://".length);
    var regex = new RegExp(cleanurl + "\\:\\:(\\[.*\\]|\\{.*\\})");

    var html = $("#motd").html() || "";
    var matches = html.match(regex);
    html = html.replace(regex, "");
    $("#motd").html(html);

    if (matches) {
      callback($.parseJSON(matches[1]));
    }
  };

  // Load ressources and fire callbacks
  var loadData = function () {
    logfn();

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
        CUSTOM.resources[key].callback.forEach(function (f) {
          f();
        });
      });
    });
  };

  // Render stars
  var renderStars = function () {
    logfn();

    $.each($('.userlist_item'), function (key, value) {
      var elem = $(value);
      formatUserlistItem(elem);
    });
  };
  CUSTOM.resources.stars.callback.push(renderStars);

  var getIntroFromName = function (name, count) {
    logfn();

    var getStatusFromCount = function (count) {
      if (0 > count) {
        return "left";
      }
      if (0 < count) {
        return "joined";
      } else {
        return "nipped out";
      }
    };
    var status = getStatusFromCount(count);
    if (name in CUSTOM.resources.intro.data && 0 < count) {
      return {
        username: "\\$server\\$",
        msg: CUSTOM.resources.intro.data[name],
        meta: { addClass: "custom-intro" },
        data: { type: "intro" },
        time: new Date().getTime()
      };
    } else if (!(USEROPTS.joinmessage && 2 <= CLIENT.rank) || 0 >= count) {
      return {
        username: "\\$server\\$",
        msg: name + " " + status,
        meta: { addClass: "server-whisper" },
        data: { type: "intro" },
        time: new Date().getTime()
      };
    }
  };

  var process_msg = function (data) {
    logfn();

    var embed_image = function (msg) {
      msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.webm|\.mp4)!!\" target=\"_blank\" rel=\"noopener noreferrer">(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.webm|\.mp4)!!<\/a>/ig, '<a href="$1$2" target="_blank"><span class="emote-fallback">$1$2</span><video src="$1$2" class="channel-user-emote" autoplay muted loop playsinline/></a>');
      msg = msg.replace(/\<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.webm|\.mp4)!\" target=\"_blank\" rel=\"noopener noreferrer">(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.webm|\.mp4)!<\/a>/ig, '<a href="$1$2" target="_blank"><span class="emote-fallback">$1$2</span><video src="$1$2" class="channel-emote" autoplay muted loop playsinline/></a>');

      msg = msg.replace(/<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+])(?::\d+)?(?:\/[^\/\s]*)*)(\.gifv)!!" target="_blank" rel="noopener noreferrer">(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.gifv)!!<\/a>/ig, '<a href="$1.webm" target="_blank"><span class="emote-fallback">$1.webm</span><video class="channel-user-emote" autoplay muted loop playsinline><source src="$1.webm"><source src="$1.mp4"/></video></a>');
      msg = msg.replace(/<a href=\"(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+])(?::\d+)?(?:\/[^\/\s]*)*)(\.gifv)!" target="_blank" rel="noopener noreferrer">(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)(\.gifv)!<\/a>/ig, '<a href="$1.webm" target="_blank"><span class="emote-fallback">$1.webm</span><video class="channel-emote" autoplay muted loop playsinline><source src="$1.webm"><source src="$1.mp4"></video></a>');

      msg = msg.replace(/<a href=\"(\w+:\/\/gfycat\.com)((?::\d+)?(?:\/[^\/\s]*)*)!!" target="_blank" rel="noopener noreferrer">(\w+:\/\/gfycat\.com)((?::\d+)?(?:\/[^\/\s]*)*)!!<\/a>/ig, '<a href="https://gfycat.com$2" target="_blank"><span class="emote-fallback">https://gfycat.com$2</span><video class="channel-user-emote" autoplay loop muted playsinline><source src="https://zippy.gfycat.com$2.webm"><source src="https://fat.gfycat.com$2.webm"><source src="https://giant.gfycat.com$2.webm"></video></a>');
      msg = msg.replace(/<a href=\"(\w+:\/\/gfycat\.com)((?::\d+)?(?:\/[^\/\s]*)*)!" target="_blank" rel="noopener noreferrer">(\w+:\/\/gfycat\.com)((?::\d+)?(?:\/[^\/\s]*)*)!<\/a>/ig, '<a href="https://gfycat.com$2" target="_blank"><span class="emote-fallback">https://gfycat.com$2</span><video class="channel-emote" autoplay loop muted playsinline><source src="https://zippy.gfycat.com$2.webm"><source src="https://fat.gfycat.com$2.webm"><source src="https://giant.gfycat.com$2.webm"></video></a>');

      msg = msg.replace(/<a href=\"(\w+:\/\/streamable\.com)((?::\d+)?(?:\/[^\/\s]*)*)!!" target="_blank" rel="noopener noreferrer">(\w+:\/\/streamable\.com)((?::\d+)?(?:\/[^\/\s]*)*)!!<\/a>/ig, '<a href="https://streamable.com$2" target="_blank"><span class="emote-fallback">https://streamable.com$2</span><video class="channel-user-emote" autoplay loop muted playsinline><source src="https://cdn.streamable.com/video/webm$2.webm"></video></a>');
      msg = msg.replace(/<a href=\"(\w+:\/\/streamable\.com)((?::\d+)?(?:\/[^\/\s]*)*)!\" target="_blank" rel="noopener noreferrer">(\w+:\/\/streamable\.com)((?::\d+)?(?:\/[^\/\s]*)*)!<\/a>/ig, '<a href="https://streamable.com$2" target="_blank"><span class="emote-fallback">https://streamable.com$2</span><video class="channel-emote" autoplay loop muted playsinline><source src="https://cdn.streamable.com/video/webm$2.webm"></video></a>');

      msg = msg.replace(/<a href=\"(\w+:\/\/imgur\.com)((?::\d+)?(?:\/[^\/\s]*)*)!!" target="_blank" rel="noopener noreferrer">(\w+:\/\/imgur\.com)((?::\d+)?(?:\/[^\/\s]*)*)!!<\/a>/ig, '<a href="https://imgur.com$2" target="_blank"><span class="emote-fallback">https://imgur.com$2</span><img class="channel-user-emote" src="https://i.imgur.com/$2.png"></a>');
      msg = msg.replace(/<a href="(\w+:\/\/imgur\.com)((?::\d+)?(?:\/[^\/\s]*)*)!" target="_blank" rel=\"noopener noreferrer">(\w+:\/\/imgur\.com)((?::\d+)?(?:\/[^\/\s]*)*)!<\/a>/ig, '<a href="https://imgur.com$2" target="_blank"><span class="emote-fallback">https://imgur.com$2</span><img class="channel-emote" src="https://i.imgur.com/$2.png"></a>');

      msg = msg.replace(/<a href="(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!!" target="_blank" rel="noopener noreferrer">(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+])(?::\d+)?(?:\/[^\/\s]*)*)!!<\/a>/ig, '<a href="$1" target="_blank"><span class="emote-fallback">$1</span><img src="$1" class="channel-user-emote" /></a>');
      msg = msg.replace(/<a href="(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^\/\s]*)*)!" target="_blank" rel="noopener noreferrer">(\w+:\/\/(?:[^:\/\[\]\s]+|\[[0-9a-f:]+])(?::\d+)?(?:\/[^\/\s]*)*)!<\/a>/ig, '<a href="$1" target="_blank"><span class="emote-fallback">$1</span><img src="$1" class="channel-emote" /></a>');
      return msg;
    };

    var colors = ["redtext", "oranjetext", "yellowtext", "kristannatext", "annatext", "elsannatext", "elsatext", "purpletext"];

    var process_rainbow = function (data) {
      var transform_rainbow_character = function (base) {
        return function (char, i) {
          return '<span class="' + colors[(base + i) % colors.length] + '">' + char + '</span>';
        }
      };

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
      };

      var transform_rainbow = function (text) {
        var mydiv = document.createElement("div");
        mydiv.innerHTML = text;
        transform_rainbow_node(mydiv, 0);
        return mydiv.innerHTML;
      };

      var rainbow = function (text) {
        var pattern = /rain{(.*)}/;
        if (text.match(pattern)) {
          return text.replace(pattern, transform_rainbow(text.match(pattern)[1]));
        } else {
          return text;
        }
      };
      data.msg = rainbow(data.msg);
      return data;
    };

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
      };

      if ("undefined" !== typeof (katex)) {
        try {
          data.msg = katex.renderToString(fixtext(data.msg));
        } catch (e) {
          console.error(e);
          console.log(fixtext(data.msg));
          console.log(data);
        }
      }
      return data;
    };

    var process_wolfram = function (data) {
      var escape = "​";

      var parse_wolfram_embed = function (msg) {
        return msg.split(escape + "; " + escape)
          .map(function (line) {
            return line.split(escape + ": " + escape)
          })
          .map(function (line) {
            return {
              "key": line[0].trim(), "value": line[1] ? line[1].split(escape + ", " + escape).map(function (str) {
                return str.trim();
              }) : []
            };
          });
      };

      var format_wolfram = function (data) {
        var lastIsContinued = false;
        var formatted_rows = data.reverse().map(function (row) {
          if (row.value.length) {
            var className = lastIsContinued ? "wolfram-row wolfram-row-continued" : "wolfram-row";
            lastIsContinued = false;
            return '<div class="' + className + '"><span class="wolfram-header">' + row.key +
              '</span><span class="wolfram-data">' + row.value.join(" | ") + "</span></div>";
          } else {
            lastIsContinued = true;
            return '<div class="wolfram-row wolfram-row-continuation"><span class="wolfram-header"></span><span class="wolfram-data">' +
              row.key + "</span></div>";
          }
        }).reverse();
        var html = '<div class="wolfram"><div class="wolfram-table">' + formatted_rows.join("") + '</div></div>';
        return html.replace(/<div class="wolfram-table"><\/div>/g, "");
      };

      var trim = function (msg) {
        msg = msg.trim();
        msg = msg.substr((escape + "t" + escape).length);
        if (msg.endsWith(escape + "!" + escape)) {
          return msg.substr(0, msg.lastIndexOf(escape + "!" + escape));
        }

        var end = Math.max(msg.lastIndexOf(escape + ", " + escape), msg.lastIndexOf(escape + "; " + escape));
        end = Math.max(end, msg.lastIndexOf(escape + ": " + escape));
        return msg.substr(0, end);
      };

      data.msg = format_wolfram(parse_wolfram_embed(trim(data.msg)));

      return data;
    };

    var is_tex = function (data) {
      return data.msg.startsWith("$$") && data.msg.endsWith("$$");
    };

    var is_wolfram = function (data) {
      var escape = "​";

      return data.msg.startsWith(escape + "t" + escape);
    };

    var process_TARS_embed = function (msg) {
      var escape = "​";

      if (msg.msg.startsWith(escape + "i" + escape)) {
        var username = msg.msg.substr((escape + "i" + escape).length, msg.msg.indexOf(":") -
          (escape + "i" + escape).length);
        username = $("<p>").html(username).text();
        return {
          username: username,
          msg: msg.msg.substr(msg.msg.indexOf(":") + 2),
          meta: { addClass: "ghost", addClassToNameAndTimestamp: "ghost" },
          time: msg.time
        };
      } else {
        return msg;
      }
    };

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

    if ("TARS" === data.username) {
      data = process_TARS_embed(data);
    }

    if (is_tex(data)) {
      data = process_tex(data);
    } else if (is_wolfram(data)) {
      try {
        data = process_wolfram(data);
      } catch (e) {

      }
    } else {
      if (CUSTOM.resources.ranks.data && 2 <= CUSTOM.resources.ranks.data[data.username]) {
        data.msg = embed_image(data.msg);
      }
      data = process_rainbow(data);
      data.msg = process_colors(data.msg);
    }
    return data;
  };

  var init_timeDisplay = function () {
    logfn();

    var time_display_time = {};
    var time_display_update;
    var time_display_interval;

    time_display_update = function () {
      var t = time_display_time.paused ? time_display_time.raw : (new Date()).getTime() / 1000 + time_display_time.ofs;
      t = Math.round(t);
      var s = t % 60;
      t = Math.floor(t / 60);
      var m = t % 60;
      var h = Math.floor(t / 60);
      var fixed = function (a) {
        if (10 > a) {
          return "0" + a;
        } else {
          return a;
        }
      };
      if (0 > time_display_time.ofs) {
        $('#time_display').html(fixed(h) + ':' + fixed(m) + ':' + fixed(s));
      }
    };

    $('#ss7_time_display').unbind().remove();
    $('#videocontrols').prepend('<button id="ss7_time_display" title="Video Time Display by ss7, thank you!" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-time"></span><span id="time_display">00:00:00</span></button>').button();

    $('#ss7_time_display').click(function () {
      $('#time_display').toggleClass('hide');
    });

    registerCallback("mediaUpdate", function (e, original) {
      original(e);
      CUSTOM.media_type = e.type;
      if ('undefined' !== typeof (time_display_time)) {
        time_display_time.paused = e.paused;
        time_display_time.raw = Math.max(e.currentTime, 0);
        time_display_time.ofs = time_display_time.raw - (new Date()).getTime() / 1000;
        time_display_update();

        if (undefined !== time_display_interval) {
          clearInterval(time_display_interval);
        }
        if (!time_display_time.paused) {
          time_display_interval = setInterval(function () {
            time_display_time.raw += 1;
            time_display_update();
          }, 1000);
        }
      }
    });
  };

  var match_highlight = function (nick, msg) {
    logfn();

    return nick !== undefined && "" !== nick && msg.username !== nick &&
      (msg.msg.toLowerCase().indexOf(nick.toLowerCase()) !== -1 ||
        msg.msg.toUpperCase().indexOf(nick.toUpperCase()) !== -1) && "server-whisper" !== msg.meta.addClass;
  };

  var process_msgbuffer = function () {
    logfn();

    var parse_message = function (obj) {
      if (!obj.attr("class").startsWith("chat-msg")) {
        return null;
      }

      var getRankFromColor = function (c) {
        return 'userlist_siteadmin' === c ? Rank.Siteadmin : 'userlist_owner' === c ? Rank.Admin : 'userlist_op' ===
          c ? Rank.Moderator : 'userlist_guest' ===
            c ? Rank.Guest : Rank.Member;
      };

      var timeText = $(obj.children()[0]).text();
      var username = obj.attr("class").substr("chat-msg-".length);
      var msg = $(obj.children().last()).html();

      timeText = timeText.substr(1, 8);
      var timeData = timeText.split(":");
      var time = new Date();
      time.setHours(+timeData[0]);
      time.setMinutes(+timeData[1]);
      time.setSeconds(+timeData[2]);

      var currentTime = new Date();
      if (currentTime < time) {
        time.setDate(time.getDate() - 1);
      }

      if (username.indexOf(" ") !== -1) {
        username = username.substr(0, username.indexOf(" "))
      }
      if ($(obj.children().last()).hasClass("action")) {
        username = msg.substr(0, msg.indexOf(" "));
        msg = msg.substr(msg.indexOf(" "));
      }

      var modflair = getRankFromColor(Array.prototype.slice.call(obj.children()[1].classList).filter(function (e) {
        return e.startsWith("userlist_");
      })[0]);

      return {
        username: username, msg: msg, meta: {
          action: $(obj.children().last()).hasClass("action"),
          modflair: modflair,
          addClass: $(obj.children().last()).attr("class"),
          addClassToNameAndTimestamp: $(obj.children()[0]).attr("class").indexOf($(obj.children()[2]).attr("class")) !==
          -1
        }, time: time.getTime()
      }
    };
    var lastmsg = { name: "" };
    $.each($('#messagebuffer').children(), function (i, elem) {
      var msg = parse_message($(elem));
      if (msg) {
        CUSTOM.userstats[msg.username] = msg.time;

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
    update_index(2);

    $('#messagebuffer').find('img.channel-emote').each(function (iter, elem) {
      if ($(elem).prev().hasClass("emote-fallback")) {
        return;
      }
      var fallback = $('<span class="emote-fallback"/>');
      fallback.html($(elem).attr("title"));
      fallback.insertBefore($(elem))
    });
  };
  externalScripts[3].callback.push(process_msgbuffer);

  var add_button = function (id, hint, callback) {
    logfn();

    if ($('#btn_' + id).length) {
      $('#btn_' + id).unbind().remove();
    }

    $("#more-opts").append('<li><a id="btn_' + id + '" href="">' + hint + '</a></li>');

    $('#btn_' + id).click(function (e) {
      var btn = $('#btn_' + id);
      var activated = btn.hasClass("label-success");
      var result = callback(activated);
      if (true === result) {
        btn.addClass("label-success").removeClass("label-default");
      } else if (false === result) {
        btn.addClass("label-default").removeClass("label-success");
      }
      e.preventDefault();
    });
  };

  var add_label = function (id, title, hint, callback) {
    logfn();

    if ($('#lbl_' + id).length) {
      $('#lbl_' + id).unbind().remove();
    }

    $('#modflair').before('<span id="lbl_' + id + '" title="' + hint +
      '" class="custom-label pull-right pointer label-default">' + title + '</span>');

    $('#lbl_' + id).click(function () {
      var btn = $('#lbl_' + id);
      var activated = btn.hasClass("label-success");
      var result = callback(activated);
      if (true === result) {
        btn.addClass("label-success").removeClass("label-default");
      } else if (false === result) {
        btn.addClass("label-default").removeClass("label-success");
      }
    });
  };

  var init_capturelist = function () {
    logfn();

    var CaptureList = function () {
      this.modal = $('#capturelist');
      this.msglist = document.querySelector('#capturelist #msglist');
      this.messages = []
    };
    CaptureList.prototype.show = function () {
      this.load();
      this.modal.modal();
    };
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
    };

    $("#capturelist").unbind().remove();
    $("#emotelist").after('<div style="display: none;" id="capturelist" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade"><div class="modal-dialog modal-dialog-fluid"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" aria-hidden="true" class="close">×</button><h4>Capture List</h4></div><div class="modal-body"><div id="msglist" class="linewrap"></div></div><div class="modal-footer"></div></div></div></div>');

    var CAPTURELIST = new CaptureList;

    registerHandler("chatMsg", function (data) {
      if (match_highlight(CLIENT.name, data)) {
        CAPTURELIST.messages.push(data);
      }
    });

    add_button("capture_list", "Capture List", function () {
      CAPTURELIST.show();
      return false;
    });
  };

  var update_clock = function () {
    logfn();

    if ("undefined" !== typeof (moment)) {
      var time = $("#lbl_clock").find("#clock_time");
      time.html(moment().utc().format(get_option("timeformat")));
    } else {
      setTimeout(update_clock, 1000);
    }
  };

  var init_clock = function () {
    logfn();

    add_label("clock", "", "", function () {
      return false;
    });
    $('#lbl_clock').html("<span id='clock_time'>0:00</span> GMT");

    update_clock();

    runEveryMinute(update_clock);
  };

  // Initialization
  var create_update_index = function () {
    var emoteindex = [];
    var userindex = [];
    var tarsindex = [];

    var get_emoteindex = function () {
      var lindex = [];
      CHANNEL.emotes.forEach(function (emote) {
        lindex.push({
          text: emote.name, probability: Number(CUSTOM.resources.emotestats.data[emote.name] || -1), type: "emote"
        });
      });
      return lindex;
    };
    var get_tarsindex = function () {
      return ["$add", "$addrandom", "$tip", "getcoins", "$findvideos", "$ban", "$blacklist", "$blacklistedusers", "$blacklistuser", "$blockedusers", "$disallowedusers", "$blockuser", "$bump", "$checkplaylist", "$choose", "$clearchat", "$currenttime", "$delete", "$deletevideos", "$disallow", "$allow", "$duplicates", "$emotes", "$forecast", "$help", "$internals", "$ipban", "$kick", "$listpermissions", "$management", "$mute", "$unmute", "$permissions", "$star", "$setstar", "$poll", "$endpoll", "$quote", "$lastspoke", "$findquote", "$quotelist", "$addquote", "$delquote", "$whois", "$restart", "$leader", "$unleader", "$settime", "$shuffle", "$debug", "$autoschedule", "$skip", "$stats", "$status", "$translate", "$unban", "$userlimit", "$weather", "$wolfram", "$embed", "$bigembed", "$firstspoke"].map(function (name) {
        return { text: name, type: "command", probability: 0 };
      });
    };
    var get_userindex = function () {
      var lindex = [];
      $("#userlist").children().each(function (i, v) {
        var name = $($(v).children()[1]).text();
        lindex.push({
          text: name, probability: (name === CLIENT.name) ? -1 : Number(CUSTOM.userstats[name] || -1), type: "user"
        });
      });
      return lindex;
    };
    var sort = function (a, b) {
      return b.probability - a.probability
    };

    return function (which) {
      var changed = false;
      if (null !== which && which & 1) {
        var old = emoteindex;
        emoteindex = get_emoteindex();
        changed = (old !== emoteindex);
      }
      if (null !== which && which & 2) {
        var old = userindex;
        userindex = get_userindex();
        changed = (old !== userindex);
      }
      if (null !== which && which & 4) {
        var old = tarsindex;
        tarsindex = get_tarsindex();
        changed = (old !== tarsindex);
      }
      if (changed) {
        CUSTOM.index = userindex.concat(tarsindex).concat(emoteindex);
        if (get_option("smarttabcomplete")) {
          CUSTOM.index.sort(sort);
        }
      }
    }
  };
  var update_index = create_update_index();
  CUSTOM.resources.emotestats.callback.push(function () {
    update_index(1);
  });

  var init_tabcomplete = function () {
    logfn();

    // Globals


    var tabComplete = function (event, chatline) {
      var extractString = function (str, position, hasSuffix) {
        str = str.substr(0, position);
        if (hasSuffix) {
          str = str.substr(0, str.length - global_autocomplete_last_suffix.length);
        }
        var lastindex = str.lastIndexOf(" ") + 1;
        return str.substr(lastindex);
      };

      var setMatch = function (str, match, caret) {
        var searchstring = str;
        if (caret) {
          searchstring = searchstring.substr(0, caret);
        }
        if (caret === global_autocomplete_last_caret && searchstring.endsWith(global_autocomplete_last_suffix)) {
          searchstring = searchstring.substr(0, searchstring.length - global_autocomplete_last_suffix.length);
        }
        var lastindex = searchstring.substr(0, caret).lastIndexOf(" ") + 1;
        var before = str.substr(0, lastindex);
        var after = str.substr(caret);
        // Append space after emote if after emote is not empty
        if ("emote" === match.type || "command" === match.type) {
          global_autocomplete_last_suffix = after.startsWith(" ") ? "" : " ";
        } else {
          if (!before.length) {
            global_autocomplete_last_suffix = ": ";
          } else {
            if (after.length && ",.;!? ".indexOf(after.charAt(0)) !== -1) {
              global_autocomplete_last_suffix = "";
            } else {
              global_autocomplete_last_suffix = " ";
            }
          }
        }
        return before + match.text + global_autocomplete_last_suffix + after;
      };

      var findMatchingEntries = function (str) {
        return CUSTOM.index.filter(function (elem) {
          return elem.text.toLowerCase().startsWith(str.toLowerCase()) ||
            elem.text.toUpperCase().startsWith(str.toUpperCase());
        })
      };

      var direction = event.shiftKey ? -1 : 1;

      var value = chatline.val();
      var caret = chatline.caret();
      var hasSuffix = (caret === global_autocomplete_last_caret &&
        value.substr(0, caret).endsWith(global_autocomplete_last_suffix));

      var input = extractString(value, caret, hasSuffix);
      if (input === global_autocomplete_last_result) {
        global_autocomplete_last_index += direction;
      } else {
        global_autocomplete_last_index = 0;
        global_autocomplete_original_query = input;
      }
      var matches = findMatchingEntries(global_autocomplete_original_query);
      // Make it roll over
      global_autocomplete_last_index = Math.modulo(global_autocomplete_last_index, matches.length);
      if (matches.length) {
        var match = matches[global_autocomplete_last_index];
        var old_suffix = hasSuffix ? global_autocomplete_last_suffix : "";
        var result = setMatch(value, match, caret);

        chatline.val(result);
        chatline.caret(caret - input.length - old_suffix.length + match.text.length +
          global_autocomplete_last_suffix.length);

        global_autocomplete_last_caret = chatline.caret();
        global_autocomplete_last_result = match.text;
      }
    };

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
          if (0 < CHATHISTIDX) {
            CHATHISTIDX--;
            $('#chatline').val(CHATHIST[CHATHISTIDX])
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
            var originalt = $('#chatline').val();
            var t = originalt;
            if (0 === t.indexOf('/r ')) {
              t = t.substring(3);
              if (t.match(/(^|\s)\/[a-z0-9A-Z\?]*(?!\S)/gi)) {
                t.match(/(^|\s)\/[a-z0-9A-Z\?]*(?!\S)/gi).forEach(function (match) {
                  t = t.replace(match, " | " + match.split("").reverse().join("") + " | ");
                })
              }
              t = t.split("").reverse().join("");
            }
            if (t.trim()) {
              var a = {};
              USEROPTS.adminhat && 255 <= CLIENT.rank ? t = '/a ' + t : USEROPTS.modhat &&
                CLIENT.rank >= Rank.Moderator &&
                (a.modflair = CLIENT.rank);
              if (2 <= CLIENT.rank && 0 === t.indexOf('/m ')) {
                a.modflair = CLIENT.rank;
                t = t.substring(3)
              }
              if (CUSTOM.chatcolor) {
                t = "ssc:" + CUSTOM.chatcolor + t;
              }
              socket.emit('chatMsg', {
                msg: t, meta: a
              });
              CHATHIST.push(originalt);
              CHATHISTIDX = CHATHIST.length;
              $('#chatline').val('')
            }
          }
          return undefined;
        default:
          return void 0;
      }
    });

    var find_pm_window = function (username) {
      var pm_window = $('#pm-' + username);
      if (0 < pm_window.length) {
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
            if (9 == ev.keyCode) {
              tabComplete(ev, $(pm_window.find('.pm-input')[0]));
              ev.preventDefault();
              return false;
            }
          });
        }
        return pm_window;
      };
    }
  };

  var render_difftime = function (time) {
    logfn();

    var calc_difftime = function (diff) {
      diff /= 1000;
      var eras = [86400, 3600, 60];
      var times = [];
      eras.forEach(function (era) {
        times.push(Math.floor(diff / era));
        diff %= era;
      });
      return times;
    };

    var times = ["d", "h", "min", "s"];
    var diff = time - new Date().getTime();
    var difftime = calc_difftime(diff);

    return difftime.map(function (val, index) {
      if (0 === val) {
        return "";
      }
      return val + times[index];
    }).reduce(function (a, b) {
      if ("" === a) {
        return b;
      }
      if ("" === b) {
        return a;
      }
      return a + ", " + b
    });
  };

  var render_nicetime = function (time) {
    logfn();

    var now = moment();
    var distance = moment(time).unix() - now.unix();
    var weekdistance = moment(time).week() - now.week();
    if (60 > distance) {
      return "Now"
    } else if (0 === weekdistance) {
      return moment(time).calendar();
    } else {
      return moment(time).format(get_option("dateformat") + " " + get_option("timeformat"))
    }
  };

  var render_time = function (time) {
    logfn();

    return render_nicetime(time) + " | " + render_difftime(time);
  };

  var init_schedulelist = function () {
    logfn();

    var Schedule = function () {
      this.modal = $('#schedulelist');
      this.table = document.querySelector('#schedulelist tbody')
    };
    Schedule.prototype.show = function () {
      this.load();
      this.modal.modal();
      runEveryMinute(function (timer) {
        if (!this.modal || !this.modal.hasClass("in")) {
          clearInterval(timer);
        } else {
          this.load();
        }
      });
    };
    Schedule.prototype.load = function (e) {
      var time = new Date().getTime();

      var is_in_future = function (e) {
        return time < e[1];
      };

      var render_event = function (data) {
        var event = {
          title: data[0], time: data[1], region: data[2], link: data[3] || ""
        };
        if (CUSTOM.mobile) {
          return '<tr><td class="vertical-middle"><a href="' + event.link + '">' +
            escape_html(event.title + (event.region ? ' [' + event.region + ']' : "")) +
            '</a></td><td class="text-left vertical-middle">' + render_nicetime(event.time) + '<br>' +
            render_difftime(event.time) + '</td></tr>';
        } else {
          return '<tr><td class="vertical-middle"><a href="' + event.link + '">' +
            escape_html(event.title + '</a></td><td class="vertical-middle">' + (event.region || "")) +
            '</td><td class="text-left vertical-middle">' + render_nicetime(event.time) +
            '</td><td class="text-left vertical-middle">' + render_difftime(event.time) + '</td></tr>';
        }
      };

      if (CUSTOM.mobile) {
        $(this.modal).find("thead").html("<tr><th>Event</th>><th>Time</th></tr>");
      } else {
        $(this.modal).find("thead").html("<tr><th>Event</th><th>Region</th><th>Time</th><th>Countdown</th></tr>");
      }

      this.table.innerHTML = CUSTOM.resources.schedule.data.filter(is_in_future).map(render_event).reduce(function (a, b) {
        return a + b;
      }, "");
    };

    $("#schedulelist").unbind().remove();
    $("#emotelist").after('<div style="display: none;" id="schedulelist" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade"><div class="modal-dialog modal-dialog-fluid"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" aria-hidden="true" class="close">×</button><h4>Schedule</h4></div><div class="modal-body"><table class="table table-striped table-condensed"><thead></thead><tbody></table></div><div class="modal-footer"></div></div></div></div>');

    return new Schedule;
  };

  var init_rulelist = function () {
    logfn();

    var RuleList = function () {
      this.modal = $('#rulelist');
      this.ruletable = document.querySelector('#ruletable tbody')
    };
    RuleList.prototype.show = function () {
      this.load();
      this.modal.modal();
    };
    RuleList.prototype.load = function (e) {
      var render_rule = function (rule, num) {
        return '<tr class="text-right"><td class="vertical-middle">' + num +
          '</td><td class="text-left vertical-middle">' + escape_html(rule) + '</td></tr>';
      };

      this.ruletable.innerHTML = $.map(CUSTOM.resources.rules.data, render_rule).reduce(function (a, b) {
        return a + b;
      });
    };

    $("#rulelist").unbind().remove();
    $("#emotelist").after('<div style="display: none;" id="rulelist" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade"><div class="modal-dialog modal-dialog-fluid"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" aria-hidden="true" class="close">×</button><h4>Rule List</h4></div><div class="modal-body"><table id="ruletable" class="table table-striped table-condensed"><thead><tr><th id="rule-id" class="text-right">No.</th><th>Rule</th></tr></thead><tbody></table></div><div class="modal-footer"></div></div></div></div>');

    return new RuleList;
  };

  var init_settings = function () {
    logfn();

    var Settings = function () {
      this.modal = $('#customsettings');
      this.table = $('#customsettings tbody');
    };
    Settings.prototype.show = function () {
      this.load();
      this.modal.modal();
    };
    Settings.prototype.load = function () {
      var render_toggle = function (name, data) {
        var elem = $('<div/>');
        var toggle = $('<input type="checkbox"/>');
        toggle.attr("id", "custom-setting-" + name);
        toggle.change(function () {
          var enabled = $(this).prop("checked");
          set_option(name, enabled);
        });

        toggle[0].checked = get_option(name);

        toggle.appendTo(elem);
        return elem;
      };

      var render_selector = function (name, data) {
        var elem = $('<div/>');
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
      };

      var render_option = function (name, data) {
        switch (data.type) {
          case "toggle":
            return render_toggle(name, data);
          case "selector":
            return render_selector(name, data);
          case "none":
            return null;
          default:
            return $('<span class="error">An error has occured</span>');
        }
      };

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
      };

      var render_line = function (name, data) {
        var line = render_opt(name, data);
        if (line) {
          $('#customsettings').find('tbody').append(line);
        }
      };

      $('#customsettings').find('tbody').unbind().html("");
      $.each(Options, render_line);
    };

    $("#customsettings").unbind().remove();
    $("#emotelist").after('<div style="display: none;" id="customsettings" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade"><div class="modal-dialog modal-dialog-fluid"><div class="modal-content"><div class="modal-header"><button data-dismiss="modal" aria-hidden="true" class="close">×</button><h4>Settings</h4></div><div class="modal-body"><table class="table table-striped table-condensed"><tbody id="customsettingstable"></tbody></table></div><div class="modal-footer"></div></div></div></div>');

    return new Settings;
  };

  var renderCountdown = function () {
    logfn();

    if ("undefined" === typeof (moment)) {
      return;
    }

    var now = new Date();
    var is_today = function (date) {
      return 360000000 > date.getTime() - now.getTime();
    };
    var pad = function (str, num) {
      return (Array(num + 1).join("0") + str).substr(-num, num);
    };
    var render_direct = function (date) {
      var diff = date.getTime() - now.getTime();
      diff = Math.floor(diff / 1000);
      var seconds = diff % 60;
      diff = Math.floor(diff / 60);
      var minutes = diff % 60;
      diff = Math.floor(diff / 60);
      var hours = diff;

      return "in " + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
    };
    var render_moment = function (date) {
      return moment(date.getTime()).fromNow();
    };
    var render = function (date) {
      return is_today(date) ? render_direct(date) : render_moment(date);
    };

    $("span.countdown[data-time]").each(function (key, el) {
      var elem = $(el);

      var date = new Date(elem.attr("data-time"));
      elem.attr("title", date.toLocaleString());
      elem.html(render(date));
    })
  };
  externalScripts[1].callback.push(renderCountdown);

  var renderScheduleButton = function () {
    logfn();

    if ("undefined" === typeof (moment) || null === CUSTOM.resources.schedule.data) {
      return;
    }

    var apply = function (text) {
      $("#btn_schedule").html(text);
      $("#schedulebtn").html(text);
    };

    var time = new Date().getTime();
    var events = CUSTOM.resources.schedule.data.filter(function (e) {
      return time < e[1];
    });

    if (0 === events.length) {
      apply("Nothing scheduled")
    } else {
      var event = events[0];
      if (!event) {
        console.error("An error occured: There are more than 0 events, but no event could be found");
        console.dir(events);
      }

      var region = 3 === event.length ? (" [" + event[2] + "]") : "";
      var divider = CUSTOM.shortSchedule ? "<br>" : " | ";
      apply(event[0] + region + divider + render_time(event[1]));
    }
  };
  CUSTOM.resources.schedule.callback.push(renderScheduleButton);
  externalScripts[1].callback.push(renderScheduleButton);

  var init_controls = function () {
    logfn();

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
    $('#customcontrols').prepend('<button id="settingsbtn" title="Settings" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-tasks"></span>&nbsp;</button>').button();
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
      EMOTELISTMODAL.modal();
    });

    renderScheduleButton();
    runEveryMinute(renderScheduleButton);

    renderCountdown();
    runEverySecond(renderCountdown);
  };


  var colorize_nick = function (str, max, min) {
    logfn();

    var hash = Math.modulo(str.hash(), 360);
    return "hsl(" + hash + ", 84%, 67%)";
  };

  var colorize_userlist_item = function (elem) {
    logfn();

    var color = colorize_nick(elem.data("name") + ": ");
    var style = elem.children()[1].style;
    if (2 > elem.data("rank")) {
      style.setProperty("color", color);
    }
  };

  var init_lyrics = function () {
    logfn();

    var render_submenu = function (data) {
      var menu = $('<li class="dropdown-submenu"><a tabindex="-1" href="#">' + data.title +
        '</a><ul class="dropdown-menu"></ul></li>');
      var container = menu.find(".dropdown-menu");
      data.children.forEach(function (val) {
        render_elem(val).appendTo(container);
      });
      return menu;
    };

    var render_entry = function (data) {
      return $('<li><a data-song="' + data.url + '" href="#">' + data.title + '</a></li>')
    };

    var render_divider = function (data) {
      return $('<li class="divider"></li>');
    };

    var render_elem = function (data) {
      if ("menu" === data.type) {
        return render_submenu(data);
      } else {
        if ("song" === data.type) {
          return render_entry(data);
        } else {
          if ("container" === data.type) {
            return render_container(data);
          } else {
            if ("divider" === data.type) {
              return render_divider(data);
            } else {
              return $('<li><a>An error occured</a></li>');
            }
          }
        }
      }
    };

    var render_container = function (data) {
      var container = $('<ul id="lyrics_menu" class="dropdown-menu" role="menu"></ul>');
      data.children.forEach(function (val) {
        render_elem(val).appendTo(container);
      });
      return container;
    };

    $('#lyrics_menu').unbind().remove();
    $('#lyricsbtn').after(render_elem(CUSTOM.resources.lyrics.data));

    $('#lyrics_menu a').click(function (e) {
      var song = $(this).attr("data-song");
      if (song && "" !== song) {
        $.ajax({
          url: path + 'lyrics/' + song, crossDomain: true, success: function (data) {
            var div = $('<div/>');
            $('#pollwrap').prepend(div);
            div.html("<button class=\"close pull-right\">×</button>" + data +
              "<button class=\"close pull-right\">×</button>");
            div.addClass('text-center well lyrics');
            div.find('button').click(function () {
              div.remove();
            });
          }
        });
      }

      e.preventDefault();
    });
  };
  CUSTOM.resources.lyrics.callback.push(init_lyrics);

  var init_options = function () {
    logfn();

    try {
      var parsed = JSON.parse(localStorage.getItem(CHANNEL.name + "-custom-options"));
      if (parsed) {
        CustomOptions = parsed;
      }
    } catch (e) {
    }
    $.each(Options, function (name, data) {
      if (!CustomOptions.hasOwnProperty(name)) {
        console.debug("Initializing option " + name + " with default value " + data.default);
        console.trace();
        CustomOptions[name] = data.default;
      }
    });
    apply_options();
  };

  var apply_pmbar_unfocus = function (apply) {
    logfn();

    $("#chatline").unbind("focusin");
    $("#chatline").unbind("focusout");

    if (apply) {
      $("#chatline").focusin(function () {
        $("#pmbar").addClass("back");
      });
      $("#chatline").focusout(function () {
        $("#pmbar").removeClass("back");
      })
    }
  };

  var apply_options = function () {
    logfn();

    set_body_class("newchat", get_option("newchat"));
    set_body_class("chatcolors", get_option("chatcolors"));
    set_body_class("thinnames", get_option("thinnames"));
    set_body_class("emote_disable", get_option("emote_disable"));
    set_body_class("intro_disable", get_option("intro_disable"));
    set_body_class("hideafkicons", get_option("hideafkicons"));
    set_body_class("large-chat", get_option("large-chat"));
    set_body_class("nice_navbar", get_option("nice_navbar"));
    display_button("emote-disable", get_option("emote_disable"));
    set_body_class("visited-links", get_option("visited_links"));
    update_index(0);
    apply_hidden_video(get_option("hide-video"));
    userlist_applyProfiles();
    set_body_class("integrated_profile", get_option("integrated_profile"));
    apply_pmbar_unfocus(get_option("pmbar_unfocus"));
    handleWindowResize();
    if ("undefined" !== typeof (moment)) {
      var lang;

      if ("auto" === get_option("language")) {
        lang = navigator.language;
      } else {
        lang = get_option("language");
      }

      lang = moment.locale(lang);

      if ("en" === lang) {
        lang = "en-au";
      }
      moment.copyLocale(lang);

      moment.locale("custom");
      moment.localeData()._longDateFormat = JSON.parse(JSON.stringify(moment.localeData()._longDateFormat));
      if ("L" !== get_option("dateformat")) {
        moment.localeData()._longDateFormat.L = get_option("dateformat");
      }
      if ("LT" !== get_option("timeformat")) {
        moment.localeData()._longDateFormat.LT = get_option("timeformat");
      }
    }
    renderScheduleButton();
    renderCountdown();
    update_clock();
    set_body_class("snow", get_option("snow"));
    set_body_class("banner", get_option("banner"));
  };
  externalScripts[1].callback.push(apply_options);

  var elem_to_user = function (i, el) {
    logfn();

    var elem = $(el);

    return {
      meta: elem.data("meta") || {},
      name: elem.data("name") || "",
      profile: elem.data("profile") || {
        image: "", text: ""
      },
      rank: elem.data("rank"),
      leader: elem.data("leader") || false,
      icon: elem.data("icon") || false,
      afk: elem.data("afk") || false
    }
  };

  var get_user = function (name) {
    logfn();

    return elem_to_user(-1, findUserlistItem(name));
  };

  var get_users = function () {
    logfn();

    return Array.prototype.slice.call($("#userlist").find(".userlist_item").map(elem_to_user));
  };

  var get_left = function (new_userlist) {
    logfn();

    return get_users().filter(function (e) {
      return new_userlist.map(function (e) {
        return e.name
      }).indexOf(e.name) === -1
    })
  };

  var get_joined = function (new_userlist) {
    logfn();

    return get_users().filter(function (e) {
      return new_userlist.map(function (e) {
        return e.name
      }).indexOf(e.name) !== -1
    })
  };

  var init_callbacks = function () {
    logfn();

    registerCallback("connect", function (event, original) {
      original(event);
      init();
    });

    registerCallback("setMotd", function (e, original) {
      original(e);
      loadData();
      renderCountdown();
    });

    registerCallback("userlist", function (event, original) {
      var handler = function () {
        get_left().forEach(Callbacks.userLeave);
        get_joined().forEach(Callbacks.addUser);
        renderStars();
      };
      if (null === CUSTOM.resources.stars.data) {
        CUSTOM.resources.stars.callback.push(handler);
        loadData();
      } else {
        handler();
      }
    });

    registerCallback("setLeader", function (event, original) {
      original(event);
      if (null !== CUSTOM.resources.stars.data) {
        renderStars();
      }
    });

    registerCallback("setUserRank", function (event, original) {
      original(event);
      if (null !== CUSTOM.resources.stars.data) {
        renderStars();
      }
    });

    registerCallback("addUser", function (e, original) {
      var is_new = !findUserlistItem(e.name);
      original(e);
      if (is_new) {
        addChatMessage(getIntroFromName(e.name, 1));
      }
      colorize_userlist_item(findUserlistItem(e.name));
      renderStars();
      userlist_profile(findUserlistItem(e.name));

      CUSTOM.userstats[e.name] = new Date().getTime();
      update_index(2);
    });

    registerCallback("userLeave", function (e, original) {
      original(e);
      addChatMessage(getIntroFromName(e.name, -1));
      renderStars();

      CUSTOM.userstats[e.name] = new Date().getTime();
      update_index(2);
    });

    registerCallback("chatMsg", function (data, original) {
      original(process_msg(data));
      if (0 === data.msg.indexOf("$star") || 0 === data.msg.indexOf("$setstar")) {
        loadData();
      }
      CUSTOM.userstats[data.username] = data.time;
      update_index(2);
    });

    registerCallback("pm", function (data, original) {
      original(process_msg(data));
      if (0 === data.msg.indexOf("$star") || 0 === data.msg.indexOf("$setstar")) {
        loadData();
      }
    });
  };

  var init_chatsizer = function () {
    logfn();

    if ($("body").hasClass("synchtube") && $("body").hasClass("fluid")) {
      add_button("large-chat", "Large Chat", function (enabled) {
        set_option("large-chat", !enabled);
        apply_options();
        return !enabled;
      });
    }
    add_label("more-settings", "...", "More", function (enabled) {
      if (enabled) {
        $("#more-opts").hide();
      } else {
        $("#more-opts").show();
      }
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
  };

  var init_better_player = function () {
    logfn();

    TwitchPlayer.prototype.load = function (e) {
      e.meta.embed = {
        src: '//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf', tag: 'object', params: {
          flashvars: 'embed=1&hostname=localhost&channel=' + e.id +
          '& eventsCallback=twitchEventCallback&auto_play=true&start_volume=' + Math.floor(100 * VOLUME)
        }
      };
      if (USEROPTS.wmode_transparent) {
        e.meta.embed.params.wmode = "transparent";
      }
      return TwitchPlayer.__super__.load.call(this, e)
    };

    UstreamPlayer.prototype.load = function (t) {
      var wmode = USEROPTS.wmode_transparent ? "transparent" : "direct";
      t.meta.embed = {
        tag: 'iframe', src: 'https://www.ustream.tv/embed/' + t.id + '?v=3&wmode=' + wmode + '&autoplay=1'
      };
      return UstreamPlayer.__super__.load.call(this, t);
    };

    if (!CUSTOM.media_type || "tw" === CUSTOM.media_type) {
      PLAYER.mediaType = "";
      PLAYER.mediaId = "";
      socket.emit("playerReady");
    }
  };

  var update_awards = function () {
    logfn();

    if (!CUSTOM.resources.awards.data) {
      return;
    }

    $("#ring_css").unbind().remove();

    var render_ring_css_single = function (url, name) {
      return "[data-name=" + name + "] > span:first-child:before {content: url('" + url + "');}\n";
    };

    var newtag = $("<style id='ring_css'></style>");
    newtag.html($.map(CUSTOM.resources.awards.data, render_ring_css_single).reduce(function (a, b) {
      return a + b
    }));
    $("head").append(newtag);
  };
  CUSTOM.resources.awards.callback.push(update_awards);

  var init_colorpicker = function () {
    logfn();

    var colors = ["#956ec8", "#ff7c80", "#faa76f", "#e7cd7a", "#8ff39c", "#46b6dc", null];

    $("#chatline").wrap('<div id="chatlinewrap" class="input-group">');
    $("#chatlinewrap").append($('<span id="colorpickwrap" class="input-group-btn dropup">'));
    $("#colorpickwrap").append('<button id="colorpickbtn" data-toggle="dropdown" href="#" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>');
    $("#colorpickwrap").append('<div role="menu" class="dropdown-menu" id="colorpopup"></div>');
    colors.forEach(function (color) {
      var el = $('<a href="" class="colorbtn" data-color="%c" style="background: %c"></a>'.replace(/%c/g, color));
      el.click(function (e) {
        e.preventDefault();

        CUSTOM.chatcolor = color;
        if (color) {
          $("#chatline")[0].style.setProperty("color", color, "important");
        } else {
          $("#chatline")[0].style.removeProperty("color");
        }
        $("#colorpickbtn").find("span.caret")[0].style.color = color;
      });
      $("#colorpopup").append(el);
    });
  };

  var init_better_scroll = function () {
    logfn();

    var check_scroll = function () {
      var elem = $("#messagebuffer");
      return 0 >= elem[0].scrollHeight - elem.scrollTop() - elem.outerHeight() - elem.children().last().height()
    };

    $("#messagebuffer").scroll(function () {
      SCROLLCHAT = check_scroll();
    });
    $('#messagebuffer').unbind("mouseleave");
    $('#messagebuffer').unbind("mouseenter");
  };

  var check_nice_navbar = function () {
    logfn();

    if (0 === window.scrollY) {
      $("nav.navbar").addClass("visible");
    } else {
      $("nav.navbar").removeClass("visible");
    }
  };

  var init_nice_navbar = function () {
    logfn();

    $(window).scroll(check_nice_navbar);
    check_nice_navbar();
  };

  var init = function () {
    logfn();

    loadData();
    init_options();
    init_tabcomplete();
    init_controls();
    init_capturelist();
    init_chatsizer();
    init_clock();
    update_index(7);
  };

  var init_once = function () {
    logfn();

    init_overloads();
    init();
    loadExternal();
    process_msgbuffer();
    init_callbacks();
    init_timeDisplay();
    init_better_player();
    init_better_scroll();
    init_nice_navbar();
    init_colorpicker();

    CUSTOM.init_done = true;
  };

  if (false === CUSTOM.init_done) {
    console.info("Initializing for first time");
    init_once();
  } else {
    console.info("Already initialized, skipping initializing");
    init();
  }

  if (true === CUSTOM.chat_only) {
    chatOnly();
  }
})();
