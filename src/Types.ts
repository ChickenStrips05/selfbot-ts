// Huge thanks to https://docs.discord.food/ Discord UserDocs for some data structures

import Member from "./api/Member"

export interface Clan {
    identity_guild_id?: string,
    identity_enabled?: boolean,
    tag?: string,
    badge?: string
}

export interface AvatarDecorationData {
	asset: string
	sku_id: string
	expires_at: number | null
}

export interface NameplateData {
	asset: string
	sku_id: string
	label: string
	palette: string
	expires_at: number | null
}

export interface Collectibles {
	nameplate: NameplateData | null
}

export interface DisplayNameStyle {
	font_id: number
	effect_id: number
	colors: number
}

export interface PartialUser {
	id: string
	username: string
	discriminator: string
	global_name?: string | null
	avatar: string | null
	avatar_decoration_data?: AvatarDecorationData | null
	collectibles?: Collectibles | null
	display_name_styles?: DisplayNameStyle | null
	primary_guild?: Clan | null
	bot?: boolean
	system?: boolean
	banner?: string | null
	accent_color?: number | null
	public_flags?: number
}

export interface MessageReference {
    channel_id: string,
    guild_id: string | null,
    message_id: string
}

export interface ContentScanMetadata {
	flags: number
	version: number
}

export enum AllowedMention {
	roles,
	users,
	everyone,
}

export interface MessageActivity {
	type: number
	session_id: string
	party_id?: string
	name_override?: string
	icon_override?: string
}

export interface Emoji {
	id: string | null
	name: string
	roles?: string[]
	user?: any
	require_colons?: boolean
	managed?: boolean
	animated?: boolean
	available?: boolean
}

export interface PollAnswer {
	answer_id: number
	poll_media: PollMedia
}

export interface PollMedia {
	text?: string
	emoji?: Emoji
}

export interface PollCreate {
	question: PollMedia
	answers: PollAnswer[]
	duration: number
	allow_multiselect?: boolean
	layout_type?: number
}

export interface Attachment {
	id: string
	filename: string
	title?: string
	uploaded_filename?: string
	description?: string
	content_type?: string
	size: number
	url: string
	proxy_url: string
	height?: number | null
	width?: number | null
	content_scan_version?: number
	placeholder_version?: number
	placeholder?: string
	ephemeral?: boolean
	duration_secs?: number
	waveform?: string
	flags?: number
	is_clip?: boolean
	is_thumbnail?: boolean
	is_remix?: boolean
	is_spoiler?: boolean
	clip_created_at?: string
	clip_participant_ids?: string[]
	clip_participants?: PartialUser[]
	application_id?: string
	application?:  | null
}

export interface MessageSendOptions {
	content?: string
	tts?: boolean
	nonce?: number
	allowed_mentions?: AllowedMention
	message_reference?: MessageReference
	/** https://docs.discord.food/resources/components#component-object */
    components?: number[]
	sticker_ids?: string[]
	activity?: MessageActivity
	application_id?: string
	flags?: number
	files?: Uint8Array
	attachments?: Attachment[]
	poll?: PollCreate
	//confetti_potion?: ConfettiPotion
	//shared_client_theme?: SharedClientTheme
	with_checkpoint?: boolean
}

export interface PermissionOverwrite {
    id: string
    type: number
    allow: number
    deny: number
}

export interface Relationship {
	id: string,
	type: number,
	user: PartialUser,
	nickname?: string,
	is_spam_request?: boolean,
	stranger_request?: boolean,
	user_ignored: boolean,
	origin_application_id?: string,
	since: string,
	has_played_game: string 
}

export interface RoleColors {
	primary_color: number
	secondary_color: number | null
	tertiary_color: number | null
}

export interface RoleUpdate {
	name?: string | null
	description?: string | null
	colors?: RoleColors | null
	hoist?: boolean | null
	icon?:  string | null
	unicode_emoji?: string | null
	permissions?: string | null
}

export interface EmojiUpdate {
	name?: string
	roles?: string[]
}

export interface StickerUpdate {
	name?: string
	description?: string | null
	tags?: string
}


export interface UpdateMember {
	nick?: string | null
	roles?: string[]
	mute?: boolean
	deaf?: boolean
	channel_id?: string
	communication_disabled_until?: string | null
	flags?: number
}

export interface UpdateSelfMember {
	nick?: string | null
	avatar?:  any | null
	avatar_decoration_id?: string | null
	avatar_decoration_sku_id?: string | null
	collectibles?: Collectibles | null
	display_name_font_id?: number | null
	display_name_effect_id?: number | null
	display_name_colors?: number
	pronouns?: string | null
	bio?: string | null
	banner?:  any | null
}

export interface UpdateSelfMemberProfile {
	pronouns?: string | null
	bio?: string | null
	banner?:  any | null
	accent_color?: number | null
	theme_colors?: [number, number]
	popout_animation_particle_type?: string | null
	emoji_id?: string | null
	profile_effect_id?: string | null
}

export interface ProfileEffect {
	id: string
	expires_at: number | null
}

export interface ProfileMetadata {
	guild_id?: string
	pronouns: string
	bio?: string
	banner?: string | null
	accent_color?: number | null
	theme_colors?: [number, number]
	popout_animation_particle_type?: string | null
	emoji?: Emoji | null
	profile_effect?: ProfileEffect | null
}

export interface GuildChannelSubscription {
	[key: string]: [[number, number]]
}

export interface GuildSubscription {
	typing?: boolean,
	activities?: boolean,
	threads?: boolean
	channels?: GuildChannelSubscription
}

export interface GuildSubscriptions {
	[key: string]: GuildSubscription
}

export interface ClientStatus {
	desktop?: string
	mobile?: string
	web?: string
	embedded?: string
	vr?: string
}

export enum Status {
	online,
	idle,
	dnd,
	invisible,
	offline,
	unknown
}

export interface Presence {
	user: PartialUser
	guild_id?: string
	status: string
	activities: any[] // add activity object later
	hidden_activities?: any[]
	client_status: ClientStatus
	has_played_game?: boolean
}

export interface GuildMembersChunk {
	guild_id: string
	members: Member[]
	chunk_index: number
	chunk_count: number
	not_found?: string[]
	presences?: Presence[]
	nonce?: string
}

