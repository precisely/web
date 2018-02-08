const SequelizeMock = require('sequelize-mock');
const DBConnectionMock = new SequelizeMock();

export const VendorDatatypeMock = DBConnectionMock.define('vendorDatatype', {
        vendor: 'test',
        data_type: 'test',
    }, {paranoid: true});
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

VendorDatatypeMock.associate = () => {};