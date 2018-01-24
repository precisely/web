import {fromJS} from 'immutable';

const inititalState = fromJS({});

// All the reducers to handle dispatched actions should be written here
export function demoReducer(state = inititalState, action: {type: string, payload: boolean}) {
    switch (action.type) {
        case 'SET_DATA':
            return action;
        default:
            return state;
    }
}