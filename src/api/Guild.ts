import Client from "../Client"
import { ProfileMetadata, UpdateMember, UpdateSelfMember, UpdateSelfMemberProfile } from "../Types"
import { formatImgUrl } from "../Utils"
import Emoji from "./Emoji"
import Member from "./Member"
import Role from "./Role"
import Sticker from "./Sticker"


export default class Guild {
    client: Client
    id: string
    name: string
    icon: string|null
    banner: string|null
    homeHeader: string|null
    splash: string|null
    discoverySplash: string|null
    ownerId: string
    description: string
    afkChannelId: string
    widgetEnabled?: boolean
    widgetChannelId?: string
    verificationLevel: number
    defaultMessageNotifications: number
    explicitContentFilter: number
    features: string[]
    roles: Role[]
    emojis: Emoji[]
    stickers: Sticker[]
    mfaLevel: number
    systemChannelId: string
    systemChannelFlags: number
    rulesChannelId: string
    publicUpdatesChannelId: string
    safetyAlertsChannelId: string
    maxPresences?: number
    maxMembers?: number
    vanityUrlCode: string
    premiumTier: number
    premiumSubscriptionCount: number
    preferredLocale: string
    
    maxVideoChannelUsers?: number
    maxStageVideoChannelUsers?: number
    nsfwLevel: number
    ownerConfiguredContentLevel: number
    hubType: number
    premiumProgressBarEnabled: boolean
    latestOnboardingQuestionId: string
    approximateMemberCount?: number
    approximatePressenceCount?: number

    constructor(data: any, client: Client) {
        this.client = client
        this.id = data.id
        this.name = data.name
        
        this.icon = data.icon || null
        this.banner = data.banner || null
        this.homeHeader = data?.home_header || null
        this.splash = data?.splash || null
        this.discoverySplash = data?.discovery_splash || null
        
        this.ownerId = data.owner_id
        this.description = data?.description || null
        this.afkChannelId = data?.afk_channel_id || null
        this.widgetEnabled = data.widget_enabled
        this.widgetChannelId = data.widget_channel_id
        this.verificationLevel = data.verification_level
        this.defaultMessageNotifications = data.default_message_notifications
        this.explicitContentFilter = data.explicit_content_filter
        this.features = data.features
        this.roles = data.roles.map((role: any) => (new Role(role, client, this.id)))
        this.emojis = data.emojis.map((emoji: any) => (new Emoji(emoji, client, this.id)))
        this.stickers = data.stickers.map((sticker: any) => (new Sticker(sticker, client)))

        this.mfaLevel = data.mfa_level
        this.systemChannelId = data?.system_channel_id || null
        this.systemChannelFlags = data.system_channel_flags
        this.rulesChannelId = data?.rules_channel_id || null
        this.publicUpdatesChannelId = data?.public_updates_channel_id || null
        this.safetyAlertsChannelId = data?.safety_alerts_channel_id || null
        this.maxPresences = data?.max_presences || null
        this.maxMembers = data?.max_members
        this.vanityUrlCode = data?.vanity_url_code || null
        this.premiumTier = data.premium_tier
        this.premiumSubscriptionCount = data.premium_subscription_count
        this.preferredLocale = data.preferred_locale

        this.maxVideoChannelUsers = data?.max_Video_channel_users || null
        this.maxStageVideoChannelUsers = data?.max_stage_video_channel_users || null
        
        this.nsfwLevel = data.nsfw_level
        this.ownerConfiguredContentLevel = data?.owner_configured_content_level || null
        this.hubType = data?.hub_type || null
        this.premiumProgressBarEnabled = data?.premium_progress_bar_enabled || null
        this.latestOnboardingQuestionId = data?.latest_onboarding_question_id || null
        
        // incident data
        // premium features
        // profile

        this.approximateMemberCount = data?.approximate_member_count || null
        this.approximatePressenceCount = data?.approximate_presence_count || null

        Object.defineProperty(this, "client", {
            value: client,
            enumerable: false,
            writable: false,
        })
    }

    async getMember(userId: string): Promise<Member> {
        return await this.client.getGuildMember(this.id, userId)
    }

    async getSelfMember(): Promise<Member> {
        return await this.client.getSelfMember(this.id)
    }

    async updateMember(userId: string, options: UpdateMember): Promise<Member> {
        return await this.client.updateMember(this.id, userId, options)
    }

    async updateSelfMember(options: UpdateSelfMember): Promise<Member> {
        // most options require premium
        return await this.client.updateSelfMember(this.id, options)
    }

    async updateSelfMemberProfile(options: UpdateSelfMemberProfile): Promise<ProfileMetadata>  {
        // most options require premium
        return await this.client.updateSelfMemberProfile(this.id, options)
    }

    async kickMember(userId: string) {
        return await this.client.kickMember(this.id, userId)
    }

    async leave() {
        return await this.client.leaveGuild(this.id)
    }

    iconUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/icons/${this.id}/${this.icon}`, format, size)
    }

    bannerUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/banners/${this.id}/${this.banner}`, format, size)
    }

    homeHeaderUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/home-headers/${this.id}/${this.homeHeader}`, format, size)
    }

    splashUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/splashes/${this.id}/${this.splash}`, format, size)
    }

    discoverySplashUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/discovery-splashes/${this.id}/${this.discoverySplash}`, format, size)
    }

    
}