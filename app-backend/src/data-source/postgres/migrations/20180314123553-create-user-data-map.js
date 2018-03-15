'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_data_map', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'userIdAndVendorDataType'
      },
      user_id: {
        type: Sequelize.STRING
      },
      opaque_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      vendor_data_type: {
        type: Sequelize.STRING,
        unique: 'userIdAndVendorDataType',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
};