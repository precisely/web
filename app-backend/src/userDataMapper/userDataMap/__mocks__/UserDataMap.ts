const SequelizeMock = require('sequelize-mock');
const DBConnectionMock = new SequelizeMock();

export const UserDataMapMock = DBConnectionMock.define('userDataMap', {}, {});
export const UserDataMap = () => UserDataMapMock;

UserDataMapMock.list = jest.fn((params: {confirmationToken: string, userId: number}) => {
    return new Promise((resolve, reject) => {
        if(params.userId >= 1) {
            resolve([UserDataMapMock.build()]);
        } else {
            reject(new Error('Some error occured'));
        }
    });
});

UserDataMapMock.associate = () => {};