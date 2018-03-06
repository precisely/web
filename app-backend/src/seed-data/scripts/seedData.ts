import {seedReport, seedGenotype} from './seedDynamo';

(() => {
    console.log('Seeding started for', process.env.DB || process.env.NODE_ENV, 'environment.');
    seedReport();
    seedGenotype();
})();
