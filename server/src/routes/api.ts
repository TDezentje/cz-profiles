import { Router } from 'express';
import * as path from 'path';
import { Profile } from '../helpers/repository';

const api = Router();

const favicon = path.resolve(path.join('dist/assets', 'favicon.ico'));
api.get('/profiles', async (req, res) => {
    
    res.send(await Profile.find());
});

api.post('/profiles', async (req, res) => {
    const body = req.body;

    if(!body.name || !body.functionTitle || !body.birthdate || !body.address){
        res.status(400).send();
        return;
    }

    const profile = new Profile({
        name: body.name,
        functionTitle: body.functionTitle,
        birthdate: body.birthdate,
        address: body.address,
        biography: body.biography
    });
    const result = await profile.save();

    res.send(result);
});

api.put('/profiles/:id', async (req, res) => {
    const body = req.body;

    if(!body.name || !body.functionTitle || !body.birthdate || !body.address){
        res.status(400).send();
        return;
    }

    const profile = <any>(await Profile.findById(req.params.id));
    profile.name = body.name;
    profile.functionTitle = body.functionTitle;
    profile.birthdate = body.birthdate;
    profile.address = body.address;
    profile.biography = body.biography;

    await profile.save();

    res.send(body);
});

api.delete('/profiles/:id', async (req, res) => {
    const profile = await Profile.findById(req.params.id);
    await profile.remove();
    res.send();
});

export default api;