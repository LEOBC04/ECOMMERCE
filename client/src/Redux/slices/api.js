export const url = 'http://localhost:3001/api'

export const setHeaders = () => {
    const headers = {
        headers: {
            "authorization": localStorage.getItem("token")
        }
    }
    return headers
}