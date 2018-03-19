import {genotypeResolver} from '../../../genotype-service/api/resolver';
import {userDataMapResolver, UserDataMapAttributes} from '../../../user-data-map/api/resolver';

export class UserData {

  constructor(userId: string, vendorDataType: string, genes: string[]) {
    this.vendorDataType = vendorDataType;
    this.userId = userId;
    this.genes = genes;
  }
  
  private userDataMap: UserDataMapAttributes;
  private userId: string;
  private genes: string[];
  private vendorDataType: string;
  
  public genotypes = async() => {
    await this.getUserInstance();
    return genotypeResolver.list({opaqueId: this.userDataMap.opaqueId, genes: this.genes});
  }

  private getUserInstance = async () => {
    this.userDataMap = await userDataMapResolver.get({
      userId: this.userId, 
      vendorDataType: this.vendorDataType
    });
  }

}
