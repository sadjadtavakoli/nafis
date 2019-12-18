import axios from 'axios';
const PROTOCOL = 'http';
const BASE = '127.0.0.1';
const PORT = 8000;
const auth = axios.create({
    baseURL: `${PROTOCOL}://${BASE}:${PORT}/login/`
});
export {PROTOCOL,BASE,PORT,auth}
