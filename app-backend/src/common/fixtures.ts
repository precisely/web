import { Item } from '@aneilbaboo/dynogels-promisified';
// tslint:disable:no-any
type AnyItem = Item<any, any>;
var rememberedFixtures: AnyItem[] = [];
/**
 * Parallel-saves one or more dynogels objects, and remembers them as fixtures
 * @param newFixtures
 * @param restFixtures
 */
export async function addFixtures(...fixtures: AnyItem[]) {
  const savedFixtures: AnyItem[] = await Promise.all(fixtures.map(f => f.saveAsync()));

  return rememberFixtures(...savedFixtures);
}

/**
 *
 * @param fixtures
 */
export function rememberFixtures(...fixtures: AnyItem[]) {
  rememberedFixtures = [...fixtures, ...rememberedFixtures];
  return fixtures;
}

/**
 * Destroys all remembered fixtures, and clears the fixture list
 */
export async function destroyFixtures() {
  await Promise.all(rememberedFixtures.map((f: any) => f.destroyAsync()));
  rememberedFixtures = [];
}
