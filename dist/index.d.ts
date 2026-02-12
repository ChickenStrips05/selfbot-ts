interface Clan {
    identity_guild_id?: string;
    identity_enabled?: boolean;
    tag?: string;
    badge?: string;
}
interface PartialUser {
    id: string;
    username: string;
    discriminator: string;
    global_name?: string | null;
    avatar: string | null;
    avatar_decoration_data?: any | null;
    collectibles?: any | null;
    display_name_styles?: any | null;
    primary_guild?: Clan | null;
    bot?: boolean;
    system?: boolean;
    banner?: string | null;
    accent_color?: number | null;
    public_flags?: number;
}
interface MessageReference {
    channel_id: string;
    guild_id: string | null;
    message_id: string;
}
interface ContentScanMetadata {
    flags: number;
    version: number;
}
declare enum AllowedMention {
    roles = 0,
    users = 1,
    everyone = 2
}
interface MessageActivity {
    type: number;
    session_id: string;
    party_id?: string;
    name_override?: string;
    icon_override?: string;
}
interface Emoji {
    id: string | null;
    name: string;
    roles?: string[];
    user?: any;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}
interface PollAnswer {
    answer_id: number;
    poll_media: PollMedia;
}
interface PollMedia {
    text?: string;
    emoji?: Emoji;
}
interface PollCreate {
    question: PollMedia;
    answers: PollAnswer[];
    duration: number;
    allow_multiselect?: boolean;
    layout_type?: number;
}
interface Attachment {
    id: string;
    filename: string;
    title?: string;
    uploaded_filename?: string;
    description?: string;
    content_type?: string;
    size: number;
    url: string;
    proxy_url: string;
    height?: number | null;
    width?: number | null;
    content_scan_version?: number;
    placeholder_version?: number;
    placeholder?: string;
    ephemeral?: boolean;
    duration_secs?: number;
    waveform?: string;
    flags?: number;
    is_clip?: boolean;
    is_thumbnail?: boolean;
    is_remix?: boolean;
    is_spoiler?: boolean;
    clip_created_at?: string;
    clip_participant_ids?: string[];
    clip_participants?: PartialUser[];
    application_id?: string;
    application?: null;
}
interface MessageSendOptions {
    content?: string;
    tts?: boolean;
    nonce?: number;
    allowed_mentions?: AllowedMention;
    message_reference?: MessageReference;
    /** https://docs.discord.food/resources/components#component-object */
    components?: number[];
    sticker_ids?: string[];
    activity?: MessageActivity;
    application_id?: string;
    flags?: number;
    files?: Uint8Array;
    attachments?: Attachment[];
    poll?: PollCreate;
    with_checkpoint?: boolean;
}
interface PermissionOverwrite {
    id: string;
    type: number;
    allow: number;
    deny: number;
}

declare class User {
    client: Client;
    id: string;
    username: string;
    globalName: string;
    discriminator: string;
    avatar: string;
    bot?: boolean;
    flags?: number;
    publicFlags?: number;
    primaryGuild?: Clan | null;
    constructor(data: any, client: Client);
    avatarUrl(format?: string | null, size?: number | null): string;
}

interface Embed {
    title?: string;
    description?: string;
}
declare class Message {
    private client;
    type: number;
    id: string;
    timestamp: string;
    editedTimestamp: string;
    content: string | null;
    embeds: Embed[];
    flags: number;
    mentions: User[];
    mentionRoles: string[];
    nonce: string | number;
    attachments: any;
    tts: any;
    pinned: any;
    messageReference: any;
    referencedMessage: any;
    channelId: string;
    guildId: string | null;
    member: any;
    authorId: any;
    author: User;
    constructor(data: any, client: Client);
    delete(): Promise<boolean>;
    edit(content: string): Promise<object | Message>;
    reply(content: string): Promise<object | Message>;
}

declare class DMChannel {
    client: Client;
    id: string;
    type: number;
    lastMessageId: string;
    flags: number;
    recipientFlags: number;
    recipients: User[];
    name: string | null;
    icon: string | null;
    ownerId: string | null;
    constructor(data: any, client: Client);
    iconUrl(format?: string | null, size?: number | null): string;
    send(options: MessageSendOptions): void;
    getMessages(limit?: number): Promise<Message[]>;
}

declare class EventEmitter {
    private events;
    constructor();
    on(event: string, listener: Function): void;
    addListener(event: string, listener: Function): void;
    emit(event: string, ...args: any): void;
    off(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    removeAllListeners(event: string): void;
}

declare class GuildTextChannel {
    client: Client;
    id: string;
    type: number;
    lastMessageId: string;
    flags: number;
    lastPinTimeStamp: string;
    guildId: string;
    name: string;
    parentId: string;
    rateLimitPerUser: number;
    topic: string;
    position: number;
    permissionOverwrites: PermissionOverwrite[];
    nsfw: boolean;
    constructor(data: any, client: Client);
    send(options: MessageSendOptions): void;
    getMessages(limit?: number): Promise<Message[]>;
}

declare class Rest {
    token: string;
    constructor(token: string);
    GET(url: string): Promise<Response>;
    POST(url: string, body: any): Promise<Response>;
}

interface GuildSubscription {
    typing?: boolean;
    activities?: boolean;
    threads?: boolean;
    channels?: [key: string];
}
interface GuildSubscriptions {
    [key: string]: GuildSubscription;
}
declare class Client extends EventEmitter {
    connected: boolean;
    ready: boolean;
    token: string;
    ws_connection: WebSocket;
    heartbeat_interval: number;
    id: string;
    username: string;
    globalName: string;
    email: string;
    verified: boolean;
    discriminator: string;
    bio: string;
    avatar: string;
    sessionId: string;
    lastSequenceNumber: number;
    Rest: Rest;
    constructor(token: string | any, debug?: boolean);
    avatarUrl(format?: string, size?: number): string;
    sendMessage(channelId: string, options: MessageSendOptions): Promise<Message | object>;
    sendTypingIndicator(channelId: string): Promise<boolean>;
    deleteMessage(channelId: string, id: string): Promise<boolean>;
    updateMessage(channelId: string, id: string, content: string): Promise<Message | object>;
    getMessages(channelId: string, limit?: number): Promise<Message[]>;
    updateGuildSubscriptions(subscriptions: GuildSubscriptions): Promise<boolean | never>;
    getAllUserChannels(): Promise<DMChannel[] | never>;
    getChannel(id: string): Promise<DMChannel | GuildTextChannel>;
}

declare class Member {
    client: Client;
    id: string;
    username: string;
    user: User | null;
    nick: string;
    roles: string[];
    premiumSince: any;
    pending: any;
    mute: any;
    flags: any;
    deaf: any;
    communicationsDisabledUntil: any;
    joinedAt: any;
    avatar: any;
    banner: any;
    constructor(data: any, client: Client);
    avatarUrl(format?: string, size?: number): string;
}

declare function formatImgUrl(base: string, format: string | null, size: number | null): string;

export { AllowedMention, type Attachment, type Clan, Client, type ContentScanMetadata, DMChannel, type Emoji, EventEmitter, GuildTextChannel, Member, Message, type MessageActivity, type MessageReference, type MessageSendOptions, type PartialUser, type PermissionOverwrite, type PollAnswer, type PollCreate, type PollMedia, Rest, User, formatImgUrl };
