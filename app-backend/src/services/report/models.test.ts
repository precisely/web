import {Report} from './models';
describe('Report model', function () {
  beforeAll(async function () {
    // nop
  });

  describe('findUniqueSlug', function () {
    it('should find a slug when no slug exists', async function () {
      const slug = await Report.findUniqueSlug('foo');
      expect(slug).toEqual('foo');
    });

  });

  // it.skip('should save content', async function () {
  //   const report = new Report({
  //     title: 'Hello this is a new report',
  //     content: '# This is a title\n* bullet1 * bullet2'
  //   });
  //   await report.saveAsync();
  // });
});
