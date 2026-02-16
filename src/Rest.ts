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

    async DELETE(url: string): Promise<Response> {
        return await fetch(url, {method: "DELETE", headers: {"Authorization": this.token}})
    }

    async PATCH(url: string, body: any): Promise<Response> {
        return await fetch(url, {method: "PATCH", headers: {"Authorization": this.token}, body: body})
    }

    async PUT(url: string): Promise<Response> {
        return await fetch(url, {method: "PUT", headers: {"Authorization": this.token}})
    }
}