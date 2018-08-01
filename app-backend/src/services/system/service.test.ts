// tslint:disable no-any
import { SystemService } from './service';
import { Report } from 'src/services/report';
import { addFixtures, destroyFixtures, rememberFixtures, resetAllTables } from 'src/common/fixtures';
import { RefIndex } from 'src/services/variant-call/types';
import { SystemVariantRequirement, SystemVariantRequirementStatus } from './models/variant-requirement';

let titleCounter = 0;
let ownerCounter = 0;
function reportFixture(svnVariants: string[], title?: string, ownerId?: string) {
  title = title || `title${titleCounter++}`;
  ownerId = ownerId || `owner${ownerCounter++}`;
  const variantFuncalls = svnVariants.map(v => `variant("${v}")`);
  return new Report({ title, ownerId, content: `{ ${variantFuncalls.join(' and ')} }`});
}

function refIndexSorter(a: RefIndex, b: RefIndex) {
  return `${a.refName}:${a.refVersion}:${a.start}`.localeCompare(`${b.refName}:${b.refVersion}:${b.start}`);
}

describe('SystemService', function () {
  beforeAll(resetAllTables);

  afterEach(destroyFixtures);

  describe('collectVariantRefIndexes', function () {
    it('should return no refIndexes if there are no reports', async function () {
      const existingReports = await Report.scan().execAsync();
      // sanity check that the test DB is empty
      expect(existingReports.Count).toEqual(0);

      const refIndexes = await SystemService.collectVariantRefIndexes();
      expect(refIndexes).toHaveLength(0);
    });

    it('should return one refIndex when there is one report with one refIndex', async function () {
      await addFixtures(reportFixture(['chr1:g.[10=];[10=]']));

      const refIndexes = await SystemService.collectVariantRefIndexes();

      expect(refIndexes).toHaveLength(1);
      expect(refIndexes[0]).toMatchObject({
        refName: 'chr1',
        start: 10
      });
    });

    it('should return two refIndex when there is one report with two refIndexes', async function () {
      await addFixtures(reportFixture(['chr1:g.[10=];[10=]', 'chr2:g.[20=];[20A>T]']));

      const refIndexes = await SystemService.collectVariantRefIndexes();

      expect(refIndexes).toHaveLength(2);
      expect(refIndexes.sort(refIndexSorter)).toMatchObject([{
        refName: 'chr1',
        start: 10
      }, {
        refName: 'chr2',
        start: 20
      }].sort(refIndexSorter));
    });

    it('should return refIndexes across multiple reports', async function () {
      await addFixtures(
        reportFixture(['chr1:g.[10=];[10=]', 'chr2:g.[20=];[20A>T]']),
        reportFixture(['chr3:g.[30=];[30=]', 'chr4:g.[40T>C];[40A>T]'])
      );

      const refIndexes = await SystemService.collectVariantRefIndexes();

      expect(refIndexes).toHaveLength(4);
      expect(refIndexes.sort(refIndexSorter)).toMatchObject([{
        refName: 'chr1',
        start: 10
      }, {
        refName: 'chr2',
        start: 20
      }, {
        refName: 'chr3',
        start: 30
      }, {
        refName: 'chr4',
        start: 40
      }].sort(refIndexSorter));
    });

    it('should return a non-redundant set of refIndexes', async function () {
      await addFixtures(
        reportFixture(['chr1:g.[10=];[10=]', 'chr2:g.[20=];[20A>T]']),
        reportFixture(['chr2:g.[20=];[20=]', 'chr4:g.[40T>C];[40A>T]'])
      );

      const refIndexes = await SystemService.collectVariantRefIndexes();

      expect(refIndexes).toHaveLength(3);
      expect(refIndexes.sort(refIndexSorter)).toMatchObject([{
        refName: 'chr1',
        start: 10
      }, {
        refName: 'chr2',
        start: 20
      }, {
        refName: 'chr4',
        start: 40
      }].sort(refIndexSorter));
    });
  });

  describe('addNewRequirementsFromReports', function () {
    it('should create SystemVariantRequirement entries based on variants mentioned in reports', async function () {
      await addFixtures(
        reportFixture(['chr1:g.[10=];[10=]', 'chr2:g.[20=];[20A>T]']),
        reportFixture(['chr3:g.[30=];[30=]', 'chr4:g.[40T>C];[40A>T]'])
      );
      await SystemService.addNewRequirementsFromReports();
      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(4);
      rememberFixtures(...svrs.Items);
    });
  });
  
  describe('updateRequirementStatuses', function () {
    it('should update only the indicated svr statuses', async function () {
      await addFixtures(new SystemVariantRequirement({
        refName: 'chr1', start: 10
      }), new SystemVariantRequirement({
        refName: 'chr2', start: 20
      }), new SystemVariantRequirement({
        refName: 'chr3', start: 30
      }));
      await SystemService.updateRequirementStatuses([
        [{refName: 'chr1', start: 10}, SystemVariantRequirementStatus.pending],
        [{refName: 'chr3', start: 30}, SystemVariantRequirementStatus.error]
      ]);

      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(3);
      expect(svrs.Items.map(svr => svr.get()).sort(refIndexSorter)).toMatchObject([
        { refName: 'chr1', start: 10, status: 'pending' },
        { refName: 'chr2', start: 20, status: 'new' },
        { refName: 'chr3', start: 30, status: 'error' }
      ].sort(<any> refIndexSorter));
    });

    it('should return errors if the variant requirements do not already exist', async function () {
      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(0);

      await addFixtures(new SystemVariantRequirement({refName: 'chr2', start: 20}));
      const result = await SystemService.updateRequirementStatuses([
        [{refName: 'chr1', start: 10}, SystemVariantRequirementStatus.pending],
        [{refName: 'chr2', start: 20}, SystemVariantRequirementStatus.ready],
        [{refName: 'chr3', start: 30}, SystemVariantRequirementStatus.error]
      ]);

      const svrsAfter = await SystemVariantRequirement.scan().execAsync();
      expect(svrsAfter.Count).toEqual(1);
      expect(result).toHaveLength(3);
      expect(result.sort(refIndexSorter)).toMatchObject([
        { refName: 'chr1', start: 10, error: expect.stringMatching(/.*/) },
        { refName: 'chr2', start: 20, status: 'ready' },
        { refName: 'chr3', start: 30, error: expect.stringMatching(/.*/) },
      ].sort(<any> refIndexSorter));
    });
  });

  describe('updateRequirementStatuses', function () {
    it('should update only the indicated svr statuses', async function () {
      await addFixtures(new SystemVariantRequirement({
        refName: 'chr1', start: 10
      }), new SystemVariantRequirement({
        refName: 'chr2', start: 20
      }), new SystemVariantRequirement({
        refName: 'chr3', start: 30
      }));
      await SystemService.updateRequirementStatuses([
        [{refName: 'chr1', start: 10}, SystemVariantRequirementStatus.pending],
        [{refName: 'chr3', start: 30}, SystemVariantRequirementStatus.error]
      ]);

      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(3);
      expect(svrs.Items.map(svr => svr.get()).sort(refIndexSorter)).toMatchObject([
        { refName: 'chr1', start: 10, status: 'pending' },
        { refName: 'chr2', start: 20, status: 'new' },
        { refName: 'chr3', start: 30, status: 'error' }
      ].sort(<any> refIndexSorter));
    });

    it('should return errors if the variant requirements do not already exist', async function () {
      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(0);

      await addFixtures(new SystemVariantRequirement({refName: 'chr2', start: 20}));
      const result = await SystemService.updateRequirementStatuses([
        [{refName: 'chr1', start: 10}, SystemVariantRequirementStatus.pending],
        [{refName: 'chr2', start: 20}, SystemVariantRequirementStatus.ready],
        [{refName: 'chr3', start: 30}, SystemVariantRequirementStatus.error]
      ]);

      const svrsAfter = await SystemVariantRequirement.scan().execAsync();
      expect(svrsAfter.Count).toEqual(1);
      expect(result).toHaveLength(3);
      expect(result.sort(refIndexSorter)).toMatchObject([
        { refName: 'chr1', start: 10, error: expect.stringMatching(/.*/) },
        { refName: 'chr2', start: 20, status: 'ready' },
        { refName: 'chr3', start: 30, error: expect.stringMatching(/.*/) },
      ].sort(<any> refIndexSorter));
    });
  });

  describe('Sunny day tests', function () {
    it('should preserve SystemVariantRequirement status', async function () {
      //
    });
  });
});
