import {genotypeResolver} from '../../../genotype-service/api/resolver';
import {userDataMapResolver, UserDataMapAttributes} from '../../../user-data-map/api/resolver';

export class UserData {

  constructor(userId: string, vendorDataType: string, genes: string[]) {
    this.vendorDataType = vendorDataType;
    this.userId = userId;
    this.genes = genes;
  }
  
  private userData: UserDataMapAttributes;
  private userId: string;
  private genes: string[];
  private vendorDataType: string;
  
  public genotypes = async() => {
    await this.getUserInstance();
    return genotypeResolver.list({opaqueId: this.userData.opaqueId, genes: this.genes});
  }

  private getUserInstance = async () => {
    this.userData = await userDataMapResolver.get({
      userId: this.userId, 
      vendorDataType: this.vendorDataType
    });
  }

}
