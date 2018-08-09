
export function ensureProps<T extends object, K extends keyof T>(
  attrs: T, ...props: K[]
): Pick<Required<T>, K> {
  for (const prop of props) {
    if (!attrs.hasOwnProperty(prop)) {
      throw new Error(`Expecting ${prop} in ${JSON.stringify(attrs)}`);
    }
  }
  return <Pick<Required<T>, K>> attrs; 
}
