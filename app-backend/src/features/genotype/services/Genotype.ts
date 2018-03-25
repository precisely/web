import {Item} from 'dynogels-promisified';
import {Genotype, GenotypeAttributes} from '../../../features/genotype/models/Genotype';
import {log} from '../../../logger';

export async function getGenotypes(opaqueId: string, genes: string[]): Promise<GenotypeAttributes[]> {
  try {
    const result: GenotypeAttributes[] = [];
    let query = Genotype.query(opaqueId).filter('geneFilter').in(genes);
    let genotypeList = await query.execAsync();

    genotypeList.Items.forEach(function (genotype: Item<GenotypeAttributes>) {
      result.push(genotype.get());
    });

    return result;
  } catch (error) {
    log.error(`genotypeResolver-list: ${error.message}`);
    throw error;
  }
}
