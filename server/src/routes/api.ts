import { Router } from 'express';
import * as path from 'path';

const api = Router();

const favicon = path.resolve(path.join('dist/assets', 'favicon.ico'));
api.get('/profiles', (req, res) => {
    res.send([
        {
            id: 1,
            name: 'test'
        }
    ]);
});

export default api;