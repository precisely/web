import batchPromises = require('batch-promises');

import { 
  SystemVariantRequirement, SystemVariantRequirementAttributes, SystemVariantRequirementStatus 
} from './models/variant-requirement';
import { Report } from 'src/services/report';
import { RefIndex, RefIndexArg } from 'src/services/variant-call/types';
import { dynamoDBDefaultBatchSize } from 'src/common/environment';

export type UpdateRequirementStatusResult = (RefIndexArg & { error?: string, status?: string });

export class SystemService {
  /**
   * Read all reports and add any new variant requirements to the SystemVariantRequirement table
   */
  static async addNewRequirementsFromReports() {
    const refIndexes = await SystemService.collectVariantRefIndexes();
    const variantRequirements = await SystemService.addVariantRequirements(refIndexes);
    return variantRequirements.map(vr => vr.get());
  }

  static async updateRequirementStatuses(
    indexesToStatuses: [RefIndexArg, SystemVariantRequirementStatus][]
  ): Promise<UpdateRequirementStatusResult[]> {
    const result: UpdateRequirementStatusResult[] = [];
    await batchPromises(
      dynamoDBDefaultBatchSize, 
      indexesToStatuses,
      async ([refIndex, status]) => {
        const id = SystemVariantRequirement.makeId(refIndex);
        try {
          const svr = await SystemVariantRequirement.updateAsync({ id, status }, {
            ConditionExpression: 'attribute_exists(id)'
          });
          result.push({...refIndex, status});
        } catch (e) {
          result.push({...refIndex, error: e.toString()});
        }
      }
    );
    return result;
  }

  static async getRequirements(
    status: SystemVariantRequirementStatus = SystemVariantRequirementStatus.new
  ): Promise<SystemVariantRequirementAttributes[]> {
    const result = await SystemVariantRequirement.query(status).usingIndex('statusIndex').execAsync();
    return result ? result.Items.map(r => r.get()) : [];
  }

  //
  // Helper methods
  //

  static async addVariantRequirements(
    requirements: SystemVariantRequirementAttributes[]
  ): Promise<SystemVariantRequirement[]> {
    // const indexes = requirements.map(SystemVariantRequirement.makeId);
    // const svReqs = await SystemVariantRequirement.getItemsAsync(indexes.map(index => ({ id: index })));
    return <any> await SystemVariantRequirement.createAsync(requirements); // tslint:disable-line no-any
  }

  static async collectVariantRefIndexes(): Promise<RefIndex[]> {
    const reports = await Report.listReports({});
    const refIndexes: { [key: string]: RefIndex } = {};
    for (const report of reports) {
      const indexes = report.get('variantCallIndexes');
      if (indexes && indexes.refIndexes) {
        for (const refIndex of indexes.refIndexes) {
          refIndexes[SystemVariantRequirement.makeId(refIndex)] = refIndex;
        }
      }
    }
    return Object.values(refIndexes);
  }
}
