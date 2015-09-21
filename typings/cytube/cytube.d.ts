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
interface CytubeUserProfile {
	image: string;
	text: string;
}
interface CytubeUserMeta {
	afk: boolean;
	muted: boolean;
}
interface CytubeUser {
	name: string;
	rank: number;
	profile: CytubeUserProfile;
	meta: CytubeUserMeta;
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
interface CytubePlaylistElement {
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
	(media: CytubeMedia): CytubePlayer;
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
	(): CytubeEmotelist;
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
interface CytubeAsyncQueue {
	(): CytubeAsyncQueue;
	next();
	lock(): number;
	release(): boolean;
	queue(item: (CytubeAsyncQueue));
	reset();
}
interface CytubeChatFilter {
	active: boolean;
	name: string;
	source: string;
	flags: string;
	replace: string;
	filterlinks: boolean;
}
interface CytubeBanEntry {
	name: string;
	id: number;
}
interface CytubePermissions {
	seeplaylist: number;
	playlistadd: number;
	playlistnext: number;
	playlistmove: number;
	playlistdelete: number;
	playlistjump: number;
	playlistaddlist: number;
	oplaylistadd: number;
	oplaylistnext: number;
	oplaylistmove: number;
	oplaylistdelete: number;
	oplaylistjump: number;
	oplaylistaddlist: number;
	playlistaddcustom: number;
	playlistaddrawfile: number;
	playlistaddlive: number;
	exceedmaxlength: number;
	addnontemp: number;
	settemp: number;
	playlistshuffle: number;
	playlistclear: number;
	pollctl: number;
	pollvote: number;
	viewhiddenpoll: number;
	voteskip: number;
	viewvoteskip: number;
	mute: number;
	kick: number;
	ban: number;
	motdedit: number;
	filteredit: number;
	filterimport: number;
	emoteedit: number;
	emoteimport: number;
	playlistlock: number;
	leaderctl: number;
	drink: number;
	chat: number;
	chatclear: number;
	exceedmaxitems: number;
}
interface CytubeRank {
	name: string;
	rank: number;
}
interface CytubePoll {
	title: string;
	initiator: string;
	options: Array<string>;
	counts: Array<number>;
}
interface CytubeUserPlaylist {
	name: string;
	count: number;
	duration: number;
}
interface CytubeMediaUpdate {
	id: string;
	currentTime: number;
	paused: boolean;
}
interface CytubeCallbacks {
	error: (error: string) => void;
	connect: () => void;
	disconnect: () => void;
	errorMsg: (event: { alert: boolean; msg: string }) => void;
	constanza: (any) => void;
	announcement: (event: { title: string; text: string }) => void;
	kick: (event: { reason: string }) => void;
	noflood: (event: { action: string; msg: string; }) => void;
	needPassword: (wrongpass: boolean) => void;
	cancelNeedPassword: () => void;
	channelNotRegistered: () => void;
	registerChannel: (event: { success: boolean; error: string }) => void;
	unregisterChannel: (event: { success: boolean; error: string }) => void;
	setMotd: (event: string) => void;
	chatFilters: (event: Array<CytubeChatFilter>) => void;
	updateChatFilter: (event: CytubeChatFilter) => void;
	deleteChatFilter: (event: CytubeChatFilter) => void;
	channelOpts: (event: { pagetitle: string; externalcss: string; externaljs: string; allow_voteskip: string; }) => void;
	setPermissions: (permissions: CytubePermissions) => void;
	channelCSSJS: (event: { css: string; js: string }) => void;
	banlist: (event: Array<CytubeBanEntry>) => void;
	banlistRemove: (user: CytubeBanEntry) => void;
	recentLogins: (event: { name: string; time: number; aliases: Array<String> }) => void;
	channelRanks: (event: Array<CytubeRank>) => void;
	channelRankFail: (event: { msg: string }) => void;
	readChanLog: (event: { success: boolean; data: string }) => void;
	voteskip: (event: { count: number; need: number }) => void;
	rank: (rank: number) => void;
	login: (event: { success: boolean; name: string; guest: boolean }) => void;
	usercount: (count: number) => void;
	chatMsg: (message: CytubeMessage) => void;
	pm: (message: CytubeMessage) => void;
	joinMessage: (message: CytubeMessage) => void;
	clearchat: () => void;
	userlist: (event: Array<CytubeUser>) => void;
	addUser: (event: CytubeUser) => void;
	setUserMeta: (event: CytubeUserMeta) => void;
	setUserProfile: (event: CytubeUserProfile) => void;
	setLeader: (name: string) => void;
	setUserRank: (event: { name: string; rank: number }) => void;
	setUserIcon: (event: { name: string; icon: string }) => void;
	setAFK: (event: { name: string; afk: boolean }) => void;
	userLeave: (event: CytubeUser) => void;
	drinkCount: (event: number) => void;
	playlist: (event: Array<CytubePlaylistElement>) => void;
	setPlaylistMeta: (event: { count: number; time: number }) => void;
	queue: (event: { item: CytubePlaylistElement; after: string|number }) => void;
	queueWarn: (event: CytubeQueueMessageMeta) => void;
	queueFail: (event: CytubeQueueMessageMeta) => void;
	setTemp: (event: { temp: boolean }) => void;
	delete: (video: CytubePlaylistElement) => void;
	moveVideo: (event: { from: number; after: string|number }) => void;
	setCurrent: (uid: number) => void;
	changeMedia: (event: CytubeMedia) => void;
	mediaUpdate: (event: CytubeMediaUpdate) => void;
	setPlaylistLocked: (event: boolean) => void;
	searchResults: (event: Array<CytubeSearchEntry>) => void;
	newPoll: (event: CytubePoll) => void;
	updatePoll: (event: CytubePoll) => void;
	closePoll: () => void;
	listPlaylists: (event: Array<CytubeUserPlaylist>) => void;
	emoteList: (event: Array<CytubeEmote>) => void;
	updateEmote: (event: CytubeEmote) => void;
	removeEmote: (event: CytubeEmote) => void;
	warnLargeChandump: (event: { limit: number; actual: number }) => void;
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
declare var makeQueueEntry: (media: CytubePlaylistElement, temporary: boolean) => void;
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
declare var playlistMove: (uid: number, position: string|number, revealduration: number) => void;
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
declare var PL_ACTION_QUEUE: CytubeAsyncQueue;
declare var socket: WebSocket;
declare var EMOTELIST: CytubeEmotelist;

declare var TwitchPlayer: CytubePlayer;
declare var VimeoPlayer: CytubePlayer;
declare var YouTubePlayer: CytubePlayerYouTube;
declare var DailymotionPlayer: CytubePlayerDailymotion;
declare var VideoJSPlayer: CytubePlayer;
declare var FilePlayer: CytubePlayer;
declare var SoundCloudPlayer: CytubePlayer;
declare var EmbedPlayer: CytubePlayer;
declare var LivestreamPlayer: CytubePlayer;
declare var CustomEmbedPlayer: CytubePlayer;
declare var RTMPPlayer: CytubePlayer;
declare var HitboxPlayer: CytubePlayer;
declare var UstreamPlayer: CytubePlayerUstream;
declare var ImgurPlayer: CytubePlayer;
declare var GoogleDriveYouTubePlayer: CytubePlayerYouTube;
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
	profile: CytubeUserProfile;
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