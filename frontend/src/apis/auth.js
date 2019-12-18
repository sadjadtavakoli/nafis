import axios from 'axios';
const PROTOCOL = 'http';
const BASE = '194.5.175.63';
const PORT = 8000;
const auth = axios.create({
    baseURL: `${PROTOCOL}://${BASE}:${PORT}/login/`
});
export {PROTOCOL,BASE,PORT,auth}
