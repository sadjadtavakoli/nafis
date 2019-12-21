import axios from 'axios';
const PROTOCOL = 'http';
const BASE = window.location.hostname;
const PORT = 8000;
const auth = axios.create({
    baseURL: `${PROTOCOL}://${BASE}:${PORT}/login/`
});
export {PROTOCOL,BASE,PORT,auth}
