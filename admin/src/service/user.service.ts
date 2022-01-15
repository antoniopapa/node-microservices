import axios, {Method} from "axios";

export class UserService {
    static async request(method: Method, url: string, data = {}, cookie = '') {
        let headers = {};

        if (cookie != '') {
            headers = {
                'Cookie': `jwt=${cookie}`
            }
        }

        try {
            const response = await axios.request({
                method,
                url,
                baseURL: process.env.USERS_MS + '/api',
                headers,
                data
            });

            return response.data;
        } catch (e) {
            console.log(e);
            return e.response.data;
        }
    }

    static async post(url: string, data = {}, cookie = '') {
        return this.request('post', url, data, cookie);
    }

    static async put(url: string, data = {}, cookie = '') {
        return this.request('put', url, data, cookie);
    }

    static async get(url: string, cookie = '') {
        return this.request('get', url, {}, cookie);
    }
}
