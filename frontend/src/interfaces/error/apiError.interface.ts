

// export interface ApiError {
//     message: string,
//     code: string
//     errors: Record<string, string[]>
//     statusCode: number
// }

export interface ApiError {
    type: string,
    title: string,
    status: number,
    detail: string,
    instance: string,
    code: string,
    errors?: Record<string, string[]>
}