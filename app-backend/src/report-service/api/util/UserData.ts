import {genotypeResolver} from '../../../genotype-service/api/resolver';
import {userDataMapResolver} from '../../../user-data-map/api/resolver';
import {UserDataMapAttributes} from '../resolver';

export class UserData {

  constructor(userId: string, vendorDataType: string, genes: string[]) {
    this.vendorDataType = vendorDataType;
    this.userId = userId;
  }
  
  private userData: UserDataMapAttributes;
  private userId: string;
  private vendorDataType: string;
  
  public genotypes = async() => {
    await this.getUserInstance();
    return genotypeResolver.list({opaqueId: this.userData.opaqueId});
  }

  private getUserInstance = async () => {
    this.userData = await userDataMapResolver.get({
      userId: this.userId, 
      vendorDataType: this.vendorDataType
    });
  }

}
