import { Router } from 'express';
import * as path from 'path';

const dynamic = Router();
const indexHtml = path.resolve('index.html');

const favicon = path.resolve(path.join('dist/assets', 'favicon.ico'));
dynamic.get('/favicon.ico', (req, res) => {
    res.sendFile(favicon);
});

dynamic.get('/*', (req, res) => {
    res.sendFile(indexHtml);
});

export default dynamic;