import axios from "axios";



const URL = "http://20.80.64.200:5000/"
export const API = axios.create({
    baseURL: URL,
});

export const connect = (username: String, password: String) => {
    return new Promise((resolve, reject) => {
        API.post("login", {
            username: username,
            password: password
        })
            .then(async (response) => {
                API.defaults.headers.common['Authorization'] = `Bearer ${response.data}`
                resolve({success: true, token: response.data});
            })
            .catch((error) => {
                reject({success: false, error: error})
            })
    })
}

export const getModules = () => {
    return new Promise((resolve, reject) => {
        API.get("devices")
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const getModule = (deviceName: String) => {
    return new Promise((resolve, reject) => {
        API.get("byDevice", { params: { deviceName: deviceName } })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
