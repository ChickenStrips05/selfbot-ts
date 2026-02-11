export function formatImgUrl(base: string, format: string|null, size: number|null) {
    return `${base}${format ? `.${format}` : ""}${size ? `?size=${size}` : ""}`
}