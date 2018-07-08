import { Profile } from '../models/profile.model';

let instance: ProfileService;

export class ProfileService extends EventTarget{
    private jsonHeaders = new Headers();

    constructor() {
        super();
        this.jsonHeaders.append('Accept', 'application/json'); // This one is enough for GET requests
        this.jsonHeaders.append('Content-Type', 'application/json');
    }

    public async create(profile: Profile) {
        const response = await fetch('/api/profiles', {
            method: 'POST',
            headers: this.jsonHeaders,
            body: JSON.stringify(profile)
        });

        const result = await this.initializeProfile(await response.json());

        this.dispatchEvent(new CustomEvent('created', {
            detail: result
        }));
        
        return result;
    }

    public async update(profile: Profile) {
        const response = await fetch(`/api/profiles/${profile._id}`, {
            method: 'PUT',
            headers: this.jsonHeaders,
            body: JSON.stringify(profile)
        });

        const result = await this.initializeProfile(await response.json());

        this.dispatchEvent(new CustomEvent('updated', {
            detail: result
        }));
        
        return result;
    }

    public async delete(profile: Profile) {
        const response = await fetch(`/api/profiles/${profile._id}`, {
            method: 'DELETE',
            headers: this.jsonHeaders
        });

        this.dispatchEvent(new CustomEvent('deleted', {
            detail: profile._id
        }));
    }

    public async list(): Promise<Profile[]> {
        const response = await fetch('/api/profiles');
        const result = await response.json();

        return result.map(this.initializeProfile)
    }

    private initializeProfile(data: any) {
        const result = new Profile();
        Object.assign(result, data);
        result.birthdate = new Date(result.birthdate);
        return result;
    }

    public static getInstance() {
        if(!instance) {
            instance = new ProfileService();
        } 
        return instance;
    }
}