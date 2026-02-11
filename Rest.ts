export default class Rest {
    token: string
    constructor(token: string) {
        this.token = token
    }

    async GET(url: string): Promise<Response> {
        return await fetch(url, {method: "GET", headers: {"Authorization": this.token}})
    }

    async POST(url: string, body: any): Promise<Response> {
        return await fetch(url, {method: "POST", headers: {"Authorization": this.token}, body: body})
    }
}