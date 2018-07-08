import * as mongoose from 'mongoose';

mongoose.connect('mongodb://root:cz-password@localhost:27017');

const ProfileSchema = new mongoose.Schema({
    name: String,
    functionTitle: String,
    birthdate: { type: Date },
    address: String,
    biography: String,
    photo: String
});
const Profile = mongoose.model('Profile', ProfileSchema);

export {Profile};