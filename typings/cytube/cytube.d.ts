///<reference path="../jquery/jquery.d.ts"/>

interface CytubeMessage {
	username: string;
	msg: string;
	time: number;
	meta: {
		addClass?: string;
		addClassToTimestampAndUsername?: string;
	};
}
interface CytubeLastMessage {
	name: string;
}
interface CytubeEmote {
	name: string;
	image: string;
	source: string;
	regex: RegExp;
}
interface CytubeProfile {
	image: string;
	text: string;
}
interface CytubeUser {
	name: string;
	rank: number;
	profile: CytubeProfile;
	meta: {
		afk: boolean;
		muted: boolean;
	}
}
interface CytubeUserBreakdown {
	'Site Admins': number;
	'Channel Admins': number;
	'Moderators': number;
	'Regular Users': number;
	'Guests': number;
	'Anonymous': number;
	'AFK': number;
}
interface CytubeMediaMetaElem {
	contentType: string;
	itag: number;
	link: string;
}
interface CytubeMediaMeta {
	direct: {
		360?: Array<CytubeMediaMetaElem>;
		480?: Array<CytubeMediaMetaElem>;
		720?: Array<CytubeMediaMetaElem>;
		1080?: Array<CytubeMediaMetaElem>;
	};
	gdrive_subtitles?: {
		available: Array<any>;
		vid: string;
	}
}
interface CytubeMedia {
	duration: string;
	id: string;
	seconds: number;
	title: string;
	type: string;
	meta: CytubeMediaMeta;
}
interface CytubeMediaContainer {
	media: CytubeMedia;
	uid: number;
	tempo: boolean;
	queueby: string;
}
interface CytubeSearchEntry {
	id: string;
	title: string;
	seconds: number;
	duration: string;
	type: string;
	meta: any;
	currentTime: number;
	paused: boolean;
	thumb: {
		url: string;
	};
}
interface CytubePlayer {
	(media: CytubeMedia);
	load(media: CytubeMedia): CytubePlayer;
	setMediaProperties(media: CytubeMedia);
	play(): boolean;
	pause(): boolean;
	seekTo(time: number);
	setVolume(volume: number);
	getTime(): number;
	isPaused(): boolean;
	getVolume(): number;
}
interface CytubePlayerYouTube extends CytubePlayer {
	onReady();
	onStateChange({ data: any});
	setQuality(quality: string);
}
interface CytubePlayerDailymotion extends CytubePlayer {
	mapQuality(quality: string);
}
interface CytubePlayerUstream extends CytubePlayer {
	mixedContentError: any;
}
interface CytubePlayerContainer {
	mediaId: string;
	mediaType: string;
	mediaLength: number;
	yt?: CytubePlayerYouTube;
	vi?: CytubePlayer;
	dm?: CytubePlayerDailymotion;
	gd?: CytubePlayerYouTube;
	gp?: CytubePlayerYouTube;
	fi?: CytubePlayer;
	jw?: CytubePlayer;
	sc?: CytubePlayer;
	li?: CytubePlayer;
	tw?: CytubePlayer;
	cu?: CytubePlayer;
	rt?: CytubePlayer;
	hb?: CytubePlayer;
	us?: CytubePlayerUstream;
	im?: CytubePlayer;
}
interface CytubeEmotelist {
	();
	handleChange();
	show();
	loadPage(index: number);
	modal: JQuery;
	table: HTMLTableElement;
	cols: number;
	itemsPerPage: number;
	emotes: Array<CytubeEmote>;
	emoteListChanged: boolean;
	page: number;
}
interface CytubeQueueMessageMeta {
	link: string;
	msg: string;
}
interface CytubeReplacedString {
	src: string;
	replace: string;
}

declare var getOpt: (key: string) => any;
declare var setOpt: (key: string, value: any) => void;
declare var getOrDefault: (key: string, defaultValue: any) => any;
declare var createCookie: (key: string, value: any, time: number) => void;
declare var readCookie: (key: string) => any;
declare var eraseCookie: (key: string) => void;
declare var setupCallbacks: () => void;
declare var makeAlert: (title: string, text: string, style: string) => void;
declare var formatURL: (url: string) => string;
declare var formatUserlistItem: (user: CytubeUser) => void;
declare var findUserlistItem: (name: string) => JQuery;
declare var getNameColor: (rank: number) => string;
declare var addUserDropDown: (user: CytubeUser) => void;
declare var calcUserBreakdown: () => CytubeUserBreakdown;
declare var sortUserlist: () => void;
declare var scrollQueue: () => void;
declare var makeQueueEntry: (media: CytubeMediaContainer, temporary: boolean) => void;
declare var makeSearchEntry: (entry: CytubeSearchEntry) => JQuery;
declare var addQueueButtons: (elem: JQuery) => void;
declare var rebuildPlaylist: () => void;
declare var showUserOptions: () => void;
declare var saveUserOptions: () => void;
declare var storeOpts: () => void;
declare var applyOpts: () => void;
declare var showPollMenu: () => void;
declare var scrollChat: () => void;
declare var hasPermission: (permission: string) => boolean;
declare var setVisible: (selector: string, visible: boolean) => void;
declare var setParentVisible: (elem: HTMLElement, visible: boolean) => void;
declare var handleModPermission: () => void;
declare var handlePermissionChange: () => void;
declare var fixWeirdButtonAlignmentIssue: () => void;
declare var clearSearchResults: () => void;
declare var addLibraryButtons: (elem: JQuery, id: string, source: string) => void;
declare var playlistFind: (uid: number) => boolean|HTMLElement;
declare var playlistMove: (uid: string, position: string|number, revealduration: number) => void;
declare var extractQueryParam: (url: string, index: number) => void;
declare var parseMediaLink: (url: string) => void;
declare var sendVideoUpdate: () => void;
declare var formatChatMessage: (message: CytubeMessage, lastmessage: CytubeLastMessage) => JQuery;
declare var addChatMessage: (message: CytubeMessage) => void;
declare var trimChatBuffer: () => void;
declare var pingMessage: (audioping: boolean) => void;
declare var compactLayout: () => void;
declare var fluidLayout: () => void;
declare var synchtubeLayout: () => void;
declare var hdLayout: () => void;
declare var chatOnly: () => void;
declare var handleWindowResize: () => void;
declare var handleVideoResize: () => void;
declare var removeVideo: (event: Event) => void;
declare var genPermissionsEditor: () => void;
declare var waitUntilDefined: (elem: Array<any>, index: number, callback: () => any) => void;
declare var hidePlayer: () => void;
declare var unhidePlayer: () => void;
declare var chatDialog: (content: HTMLElement) => JQuery;
declare var errDialog: (content: HTMLElement) => JQuery;
declare var queueMessage: (meta: CytubeQueueMessageMeta, type: string) => void;
declare var setupChanlogFilter: (filter: string) => string;
declare var filterChannelLog: () => boolean|string;
declare var makeModal: () => JQuery;
declare var formatCSModList: () => number;
declare var formatCSBanlist: () => JQuery;
declare var checkEntitiesInStr: (str: string) => CytubeReplacedString|boolean;
declare var formatCSChatFilterList: () => void;
declare var formatCSEmoteList: () => void;
declare var formatTime: (time: number) => string;
declare var formatUserPlaylistList: () => number;
declare var loadEmotes: (emotelist: Array<CytubeEmote>) => void;
declare var execEmotes: (text: string) => string;
declare var initPm: (username: string) => JQuery;
declare var killVideoUntilItIsDead: (elem: JQuery) => void;
declare var fallbackRaw: (media: CytubeMedia) => void;
declare var checkScriptAccess: (url: string, scripttype: string, callback: (string) => any) => void;
declare var formatScriptAccessPrefs: () => void;
declare var vimeoSimulator2014: (media: CytubeMedia) => CytubeMediaMetaElem;
declare var googlePlusSimulator2014: (media: CytubeMedia) => CytubeMediaMetaElem;
declare var showChannelSettings: () => void;
declare var chatTabComplete: () => void;
declare var queue: (event: Event, type: string) => void;
declare var chanrankSubmit: (rank: number) => void;
declare var toggleUserlist: () => void;

declare var Callbacks: any;
declare var PLAYER: CytubePlayerContainer;
declare var JSPREF: any;
declare var PL_ACTION_QUEUE: any;
declare var socket: WebSocket;
declare var EMOTELIST: CytubeEmotelist;

declare var TwitchPlayer: CytubePlayer;
declare var VimeoPlayer: CytubePlayer;
declare var YouTubePlayer: CytubePlayer;
declare var DailymotionPlayer: CytubePlayer;
declare var VideoJSPlayer: CytubePlayer;
declare var FilePlayer: CytubePlayer;
declare var SoundCloudPlayer: CytubePlayer;
declare var EmbedPlayer: CytubePlayer;
declare var LivestreamPlayer: CytubePlayer;
declare var CustomEmbedPlayer: CytubePlayer;
declare var RTMPPlayer: CytubePlayer;
declare var HitboxPlayer: CytubePlayer;
declare var UstreamPlayer: CytubePlayer;
declare var ImgurPlayer: CytubePlayer;
declare var GoogleDriveYouTubePlayer: CytubePlayer;
declare var Player: CytubePlayer;

declare var CL_VERSION: number;
declare var SUPERADMIN: number;
declare var VWIDTH: number;
declare var VHEIGHT: number;
declare var CHATHISTIDX: number;
declare var CHATMAXSIZE: number;
declare var PL_CURRENT: number;
declare var FILTER_FROM: number;
declare var FILTER_TO: number;
declare var VOLUME: number;

declare var LIVESTREAM_CHROMELESS: boolean;
declare var FLUIDLAYOUT: boolean;
declare var REBUILDING: boolean;
declare var CHATTHROTTLE: boolean;
declare var SCROLLCHAT: boolean;
declare var REBUILDING: boolean;
declare var FOCUSED: boolean;
declare var TITLE_BLINK: boolean;
declare var KICKED: boolean;
declare var LEADTMR: boolean;
declare var PL_WAIT_SCROLL: boolean;
declare var NO_STORAGE: boolean;
declare var NO_WEBSOCKETS: boolean;
declare var NO_VIMEO: boolean;

declare var PAGETITLE: string;
declare var NAME: string;
declare var SESSION: string;
declare var PL_FROM: string;
declare var PL_AFTER: string;

declare var LASTCHAT: CytubeLastMessage;
declare var CHATHIST, IGNORED: Array<string>;
declare var CHATSOUND: HTMLAudioElement;

declare var CLIENT: {
	rank: number;
	leader: boolean;
	name: string;
	logged_in: boolean;
	profile: CytubeProfile;
}
declare var CHANNEL: {
	opts: any;
	openqueue: boolean;
	perms: any;
	css: string;
	js: string;
	motd: string;
	name: boolean;
	usercount: number;
	emotes: Array<CytubeEmote>;
}
declare var USEROPTS: {
	theme: string;
	layout: string;
	synch: boolean;
	hidevid: boolean;
	show_timestamps: boolean;
	modhat: boolean;
	blink_title: string;
	sync_accuracy: number;
	wmode_transparent: boolean;
	chatbtn: boolean;
	altsocket: boolean;
	joinmessage: boolean;
	qbtn_hide: boolean;
	qbtn_idontlikechange: boolean;
	first_visit: boolean;
	ignore_channelcss: boolean;
	ignore_channeljs: boolean;
	sort_rank: boolean;
	sort_afk: boolean;
	default_quality: string;
	boop: string;
	secure_connection: boolean;
	show_shadowchat: boolean;
	emotelist_sort: boolean;
	no_emotes: boolean;
}
declare var Rank: {
	Guest: number,
	Member: number,
	Leader: number,
	Moderator: number,
	Admin: number,
	Owner: number,
	Siteadmin: number
};