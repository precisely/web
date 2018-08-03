import batchPromises = require('batch-promises');

import { 
  SystemVariantRequirement, SystemVariantRequirementAttributes, SystemVariantRequirementStatus 
} from './models/variant-requirement';
import { Report } from 'src/services/report';
import { RefIndex, RefIndexArg } from 'src/services/variant-call/types';
import { dynamoDBDefaultBatchSize } from 'src/common/environment';
import { batchCreate, batchUpdate } from 'src/db/dynamo';

export type BatchItem<T> = { data: T, error?: string };

export class SystemService {
  /**
   * Read all reports and add any new variant requirements to the SystemVariantRequirement table
   * Returns a list of attributes representing SystemVariantRequirement objects
   */
  static async addNewVariantRequirementsFromReports() {
    const refIndexes = await SystemService.collectVariantRefIndexes();
    return await SystemService.addVariantRequirements(refIndexes);
  }

  static async updateVariantRequirementStatuses(
    attrList: SystemVariantRequirementAttributes[]
  ): Promise<{ variantRequirements: BatchItem<SystemVariantRequirementAttributes>[]}> {
    const normalizedAttrs = attrList.map(attrs => {
      const result = { ...attrs, id: SystemVariantRequirement.makeId(attrs) };
      return result;
    });
    return {
      variantRequirements: await batchUpdate(SystemVariantRequirement, normalizedAttrs, {
        ConditionExpression: 'attribute_exists(id)'
      })
    };
  }

  static async getVariantRequirements(
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
  ): Promise<BatchItem<SystemVariantRequirementAttributes>[]> {
    // const indexes = requirements.map(SystemVariantRequirement.makeId);
    // const svReqs = await SystemVariantRequirement.getItemsAsync(indexes.map(index => ({ id: index })));
    return await batchCreate(SystemVariantRequirement, requirements, {
      ConditionExpression: 'attribute_not_exists(id)'
    });
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
