const SequelizeMock = require('sequelize-mock');
const DBConnectionMock = new SequelizeMock();

export const VendorDatatypeMock = DBConnectionMock.define('vendorDatatype', {
        vendor: 'test',
        data_type: 'test',
    }, {
        instanceMethods: {
            update: jest.fn(() => VendorDatatypeMock.build()),
            destroy: jest.fn(()=>{}),
        },
        paranoid: true
    });
export const VendorDatatype = () => VendorDatatypeMock;

VendorDatatypeMock.findAll = jest.fn(() => {
        return [VendorDatatypeMock.build()];
    })

VendorDatatypeMock.findById = jest.fn((id: number) => {
    return new Promise((resolve, reject) => {
        if(id >= 1) {
            resolve(VendorDatatypeMock.build());
        } else {
            resolve();
        }
    });
});

VendorDatatypeMock.create = jest.fn((args: {vendor: string, data_type: string}) => {
    return new Promise((resolve, reject) => {
        if(args.vendor && args.data_type) {
            resolve(VendorDatatypeMock.build());
        } else {
            reject(new Error('mock-create error'));
        }
    });
});

VendorDatatypeMock.destroy = jest.fn((args: {where: {id: number}}) => {
    return new Promise((resolve, reject) => {
        if(args.where.id >=1) {
            resolve(1);
        } else {
            resolve(0);
        }
    });
});

VendorDatatypeMock.associate = () => {};