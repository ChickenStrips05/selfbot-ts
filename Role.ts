// UNFINISHED

import Client from "./Client"
import { formatImgUrl } from "./Utils"

export default class Role {
    client: Client
    id: string
    name: string
    constructor (data: any, client: Client) {
        this.client = client
        
        this.id = data.id
        this.name = data.name
        this.tags = data.tags
        this.permissions = data.permissions
        this.mentionable = data.mentionable
        this.managed = data.managed
        this.hoist = data.hoist
        this.flags = data.flags
        this.colors = data.colors
        this.color = data.color
        this.icon = data.icon
        this.position = data.position
        this.unicodeEmoji = data.unicodeEmoj
    }

    iconUrl(format: string|null = null, size: number|null = null) {
        return formatImgUrl(`https://cdn.discordapp.com/role-icons/${this.id}/${this.icon}`, format, size)
    }
}