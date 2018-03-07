import {seedReport, seedGenotype} from './seedDynamo';

const setEnvironment = (secrets: string) => {
    const lines: string[] = secrets.slice(1, secrets.length - 1).split(',');
    
    lines.forEach((line: string): void => {
        const key: string = line.split(':')[0];
        const value: string = line.split(':')[1];
        process.env[key] = value;
    });
};

(async () => {
    console.log('Seeding started for', process.env.DB || process.env.NODE_ENV, 'environment.');
    setEnvironment(process.argv.pop());
    const {seedUser} = await import('./seedPostgres');
    
    seedReport();
    seedGenotype();
    seedUser();
})();
