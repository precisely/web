import {Report} from './models';
import {rememberFixtures, destroyFixtures} from 'src/common/fixtures';
describe('Report model', function () {
  afterEach(() => destroyFixtures());

  describe('findUniqueSlug', function () {
    it('should find a slug when no slug exists', async function () {
      const slug = await Report.findUniqueSlug('foo');
      expect(slug).toEqual('foo');
    });

  });

  it('should save content', async function () {
    const report = new Report({
      title: 'Hello this is a new report',
      content: '# This is a title\n* bullet1 * bullet2',
      ownerId: 'user123'
    });
    const savedReport = await report.saveAsync();
    rememberFixtures(savedReport);
    expect(savedReport).toBeInstanceOf(Report);
    expect(savedReport.get('slug')).toMatch(/^hello-this-is-a-new-report/);
  });
});
