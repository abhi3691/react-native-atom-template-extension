export function toCamelCase(input: string): string {
  return input.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
}
