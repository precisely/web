import batchPromises = require('batch-promises');

import { 
  SystemVariantRequirement, SystemVariantRequirementAttributes, SystemVariantRequirementStatus 
} from './models/variant-requirement';
import { Report } from 'src/services/report';
import { batchCreate, batchUpdate } from 'src/db/dynamo';
import { VariantIndex } from 'src/common/variant-tools';

export type BatchItem<T> = { data: T, error?: string };

export class SystemService {
  /**
   * Read all reports and add any new variant requirements to the SystemVariantRequirement table
   * Returns a list of attributes representing SystemVariantRequirement objects
   */
  static async addNewVariantRequirementsFromReports() {
    const refIndexes = await SystemService.collectVariantIndexes();
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

  /**
   * Gets a de-duped set of variant indexes from all reports in the system
   */
  static async collectVariantIndexes(): Promise<VariantIndex[]> {
    const reports = await Report.listReports({});
    const variantIndexes: { [key: string]: VariantIndex } = {};
    for (const report of reports) {
      const indexes = report.get('variantIndexes');
      if (indexes) {
        for (const variantIndex of indexes) {
          variantIndexes[SystemVariantRequirement.makeId(variantIndex)] = variantIndex;
        }
      }
    }
    return Object.values(variantIndexes);
  }
}
