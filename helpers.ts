export function includesSome(string: string, values: string[]) {
  let includes = false;
  values.map((value) => {
    if (string.includes(string)) {
      includes = true;
    }
  });
  return includes;
}
