// Huge thanks to https://docs.discord.food/ Discord UserDocs for some data structures

export interface Clan {
    identity_guild_id?: string,
    identity_enabled?: boolean,
    tag?: string,
    badge?: string
}


export interface PartialUser {
	id: string
	username: string
	discriminator: string
	global_name?: string | null
	avatar: string | null
	avatar_decoration_data?: any | null
	collectibles?: any | null
	display_name_styles?: any | null
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