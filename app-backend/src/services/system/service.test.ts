// tslint:disable no-any
import { SystemService } from './service';
import { Report } from 'src/services/report';
import { addFixtures, destroyFixtures, rememberFixtures, resetAllTables } from 'src/common/fixtures';
import { SystemVariantRequirement, SystemVariantRequirementStatus } from './models/variant-requirement';
import { VariantIndex } from 'src/common/variant-tools';

let titleCounter = 0;
let ownerCounter = 0;
function reportFixture(svnVariants: string[], title?: string, ownerId?: string) {
  title = title || `title${titleCounter++}`;
  ownerId = ownerId || `owner${ownerCounter++}`;
  const variantFuncalls = svnVariants.map(v => `variantCall("${v}")`);
  return new Report({ title, ownerId, content: `{ ${variantFuncalls.join(' and ')} }`});
}

function refIndexSorter(a: VariantIndex, b: VariantIndex) {
  return `${a.refName}:${a.refVersion}:${a.start}`.localeCompare(`${b.refName}:${b.refVersion}:${b.start}`);
}

describe('SystemService', function () {
  beforeAll(resetAllTables);

  afterEach(destroyFixtures);

  describe('collectVariantIndexes', function () {
    it('should return no refIndexes if there are no reports', async function () {
      const existingReports = await Report.scan().execAsync();
      // sanity check that the test DB is empty
      expect(existingReports.Count).toEqual(0);

      const refIndexes = await SystemService.collectVariantIndexes();
      expect(refIndexes).toHaveLength(0);
    });

    it('should return one refIndex when there is one report with one refIndex', async function () {
      await addFixtures(reportFixture(['chr1.37p13:g.[10=];[10=]']));

      const refIndexes = await SystemService.collectVariantIndexes();

      expect(refIndexes).toHaveLength(1);
      expect(refIndexes[0]).toMatchObject({
        refName: 'chr1',
        start: 10
      });
    });

    it('should return two refIndex when there is one report with two refIndexes', async function () {
      await addFixtures(reportFixture(['chr1.37p13:g.[10=];[10=]', 'chr2.37p13:g.[20=];[20A>T]']));

      const refIndexes = await SystemService.collectVariantIndexes();

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
        reportFixture(['chr1.37p13:g.[10=];[10=]', 'chr2.37p13:g.[20=];[20A>T]']),
        reportFixture(['chr3.37p13:g.[30=];[30=]', 'chr4.37p13:g.[40T>C];[40A>T]'])
      );

      const refIndexes = await SystemService.collectVariantIndexes();

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
        reportFixture(['chr1.37p13:g.[10=];[10=]', 'chr2.37p13:g.[20=];[20A>T]']),
        reportFixture(['chr2.37p13:g.[20=];[20=]', 'chr4.37p13:g.[40T>C];[40A>T]'])
      );

      const refIndexes = await SystemService.collectVariantIndexes();

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

    it('should correctly return refindexes for 3 reports', async function () {
      await addFixtures(
        reportFixture(['chr1.37p13:g.[10=];[10=]']),
        reportFixture(['chr1.37p13:g.[10=];[10=]', 'chr2.37p13:g.[20=];[20=]', 'chr3.37p13:g.[30=];[30=]']),
        reportFixture(['chr4.37p13:g.[40=];[40=]', 'chr5.37p13:g.[50=];[50=]', 'chr6.37p13:g.[60=];[60=]'])
      );

      const {Count: reportCount} = await Report.scan().execAsync();
      expect(reportCount).toEqual(3);
      const refIndexes = await SystemService.collectVariantIndexes();
      expect(refIndexes).toHaveLength(6);
    });
  });

  describe('addNewRequirementsFromReports', function () {
    it('should create no variants if there are no reports', async function () {
      const {Count: reportCount} = await Report.scan().execAsync();
      expect(reportCount).toEqual(0);
      await SystemService.addNewVariantRequirementsFromReports();
      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(0);
    });
    
    it('should create SystemVariantRequirement entries based on variants mentioned in reports', async function () {
      await addFixtures(
        reportFixture(['chr1.37p13:g.[10=];[10=]', 'chr2.37p13:g.[20=];[20A>T]']),
        reportFixture(['chr3.37p13:g.[30=];[30=]', 'chr4.37p13:g.[40T>C];[40A>T]'])
      );
      await SystemService.addNewVariantRequirementsFromReports();
      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(4);
      rememberFixtures(...svrs.Items);
    });

    it('should create SystemVariantRequirement entries based on redundant variants', async function () {
      await addFixtures(
        reportFixture(['chr1.37p13:g.[10=];[10=]']),
        reportFixture(['chr1.37p13:g.[10=];[10=]', 'chr2.37p13:g.[20=];[20=]', 'chr3.37p13:g.[30=];[30=]']),
        reportFixture(['chr4.37p13:g.[40=];[40=]', 'chr5.37p13:g.[50=];[50=]', 'chr6.37p13:g.[60=];[60=]'])
      );

      const {Count: reportCount} = await Report.scan().execAsync();
      expect(reportCount).toEqual(3);
      await SystemService.addNewVariantRequirementsFromReports();
      const {Items: svrs, Count: svrCount} = await SystemVariantRequirement.scan().execAsync();
      expect(svrCount).toEqual(6);
      rememberFixtures(...svrs);
    });
  });
  
  describe('updateRequirementStatuses', function () {
    it('should update only the indicated svr statuses', async function () {
      const initialSVRs = await SystemVariantRequirement.scan().execAsync();
      expect(initialSVRs.Count).toEqual(0);

      await addFixtures(new SystemVariantRequirement({
        refName: 'chr1', refVersion: '37p13', start: 10
      }), new SystemVariantRequirement({ 
        refName: 'chr2', refVersion: '37p13', start: 20
      }), new SystemVariantRequirement({
        refName: 'chr3', refVersion: '37p13', start: 30
      }));
      await SystemService.updateVariantRequirementStatuses([
        {refName: 'chr1', refVersion: '37p13', start: 10, status: SystemVariantRequirementStatus.pending},
        {refName: 'chr3', refVersion: '37p13', start: 30, status: SystemVariantRequirementStatus.error }
      ]);

      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(3);
      expect(svrs.Items.map(svr => svr.get()).sort(refIndexSorter)).toMatchObject([
        { refName: 'chr1', refVersion: '37p13', start: 10, status: 'pending' },
        { refName: 'chr2', refVersion: '37p13', start: 20, status: 'new' },
        { refName: 'chr3', refVersion: '37p13', start: 30, status: 'error' }
      ].sort(<any> refIndexSorter));
    });

    it('should return errors if the variant requirements do not already exist', async function () {
      const svrs = await SystemVariantRequirement.scan().execAsync();
      expect(svrs.Count).toEqual(0);

      await addFixtures(new SystemVariantRequirement({refName: 'chr2', refVersion: '37p13', start: 20}));
      const result = await SystemService.updateVariantRequirementStatuses([
        {refName: 'chr1', refVersion: '37p13', start: 10, status: SystemVariantRequirementStatus.pending },
        {refName: 'chr2', refVersion: '37p13', start: 20, status: SystemVariantRequirementStatus.ready },
        {refName: 'chr3', refVersion: '37p13', start: 30, status: SystemVariantRequirementStatus.error }
      ]);

      const svrsAfter = await SystemVariantRequirement.scan().execAsync();
      expect(svrsAfter.Count).toEqual(1);
      expect(result.variantRequirements).toHaveLength(3);
      expect(result.variantRequirements).toMatchObject([
        { data: { refName: 'chr1', refVersion: '37p13', start: 10 }, error: expect.stringMatching(/.*/) },
        { data: { refName: 'chr2', refVersion: '37p13', start: 20, status: 'ready' }},
        { data: { refName: 'chr3', refVersion: '37p13', start: 30 }, error: expect.stringMatching(/.*/) },
      ]);
    });
  });

  describe('getRequirements', function () {
    beforeEach(async function () {
      await addFixtures(
        reportFixture(['chr1.37p13:g.[10=];[10=]']),
        reportFixture(['chr1.37p13:g.[10=];[10=]', 'chr2.37p13:g.[20=];[20=]', 'chr3.37p13:g.[30=];[30=]']),
        reportFixture(['chr4.37p13:g.[40=];[40=]', 'chr5.37p13:g.[50=];[50=]', 'chr6.37p13:g.[60=];[60=]'])
      );
      await SystemService.addNewVariantRequirementsFromReports();
      const {Items: svrs} = await SystemVariantRequirement.scan().execAsync();
      rememberFixtures(...svrs);
    });

    it('should collect new requirements by default', async function () {
      const newRequirements = await SystemService.getVariantRequirements();
      expect(newRequirements).toHaveLength(6);
    });

    it('should detect updated requirements', async function () {
      await SystemService.updateVariantRequirementStatuses([
        { refName: 'chr1', refVersion: '37p13', start: 10, status: SystemVariantRequirementStatus.pending },
        { refName: 'chr2', refVersion: '37p13', start: 20, status: SystemVariantRequirementStatus.pending },
        { refName: 'chr3', refVersion: '37p13', start: 30, status: SystemVariantRequirementStatus.ready },
        { refName: 'chr4', refVersion: '37p13', start: 40, status: SystemVariantRequirementStatus.ready },
        { refName: 'chr5', refVersion: '37p13', start: 50, status: SystemVariantRequirementStatus.error },
      ]);
      const newReqs = await SystemService.getVariantRequirements(SystemVariantRequirementStatus.new);
      const pending = await SystemService.getVariantRequirements(SystemVariantRequirementStatus.pending);
      const ready = await SystemService.getVariantRequirements(SystemVariantRequirementStatus.ready);
      const error = await SystemService.getVariantRequirements(SystemVariantRequirementStatus.error);

      expect(newReqs).toHaveLength(1);
      expect(pending).toHaveLength(2);
      expect(ready).toHaveLength(2);
      expect(error).toHaveLength(1);
    });

  });
});
