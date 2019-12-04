import axios from 'axios';
const PROTOCOL = 'http';
const BASE = 'localhost';
const PORT = 8000;
const auth = axios.create({
    baseURL: `${PROTOCOL}://${BASE}:${PORT}/login/`
});
export {PROTOCOL,BASE,PORT,auth}
