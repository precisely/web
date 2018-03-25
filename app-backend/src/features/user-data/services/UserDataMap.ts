import {UserDataMap} from '../../../features/user-data/models/UserDataMap';
import {log} from '../../../logger';

export async function getOpaqueId(userId: string, vendorDataType: string): Promise<string> {
  try {
    let userDataMapInstance = await UserDataMap.findOne({
      where: {
        user_id: userId,
        vendor_data_type: vendorDataType
      }
    });

    if (!userDataMapInstance) {
      throw new Error('No such user found');
    }

    return userDataMapInstance.get({plain: true}).opaque_id;
  } catch (error) {
    log.error(`userDataMap-getOpaqueId: ${error.message}`);
    throw error;
  }
}
