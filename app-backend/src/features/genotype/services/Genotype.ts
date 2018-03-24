import {Genotype, GenotypeAttributes} from 'src/features/genotype/models/Genotype';
import {log} from 'src/logger';

export async function getGenotypes(opaqueId: string, genes: string[]): Promise<GenotypeAttributes[]> {
  try {
    const result: GenotypeAttributes[] = [];
    let query = Genotype.query(opaqueId).filter('geneFilter').in(genes);
    let genotypeList = await query.execAsync();

    genotypeList.Items.forEach(genotype => {
      result.push(genotype.get());
    });

    return result;
  } catch (error) {
    log.error(`genotypeResolver-list: ${error.message}`);
    return error;
  }
}
