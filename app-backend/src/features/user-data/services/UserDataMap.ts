import {UserDataMap} from '../../../features/user-data/models/UserDataMap';

export async function getOpaqueId(userId: string, vendorDataType: string): Promise<string> {
  let userDataMapInstance = await UserDataMap.findOne({
    where: {
      user_id: userId,
      vendor_data_type: vendorDataType
    }
  });

  return userDataMapInstance.get({plain: true}).opaque_id;
}
