import axios from 'axios';

const client = axios.create({
    baseURL: 'http://'+window.location.hostname+':5000'
});

export default client;