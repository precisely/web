declare module "jest-plugin-context" {
  var context: (name: string, fn: () => void) => void;
  export default context;
}
