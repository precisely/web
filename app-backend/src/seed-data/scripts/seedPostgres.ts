import * as fs from 'fs';
import * as path from 'path';
import * as Bluebird from 'bluebird';
import {UserDataMap, UserDataMapAttributes} from '../../user-data-map/models/UserDataMap';

const jsonPath = path.join(__dirname, '..', 'data/');

export const seedUser = async () => {
    // UserDataMap.sync({force: true});
    const promises: Bluebird<boolean>[] = [];
    const allUsers = JSON.parse(fs.readFileSync(jsonPath + 'UserData.json', 'utf8'));
    allUsers.forEach((user: UserDataMapAttributes) => {
        promises.push(UserDataMap.upsert(user));
    });
    await Promise.all(promises);
    process.exit();
};
