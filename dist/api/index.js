import fetch from 'node-fetch';
import { apiKey } from '../util/constants';
const params = {
    apiKey,
    compact: 'ultra',
    target: 'BRL',
    from: 'USD',
};
const baseUrl = 'https://free.currconv.com/api/v7/convert';
const url = `${baseUrl}?q=${params.from}_${params.target}&compact=${params.compact}&apiKey=${params.apiKey}`;
const response = await fetch(url);
const body = await response.text();
console.log(body);
