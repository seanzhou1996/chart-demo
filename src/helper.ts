export function csvToJson(csv: string, delimiter = ','): string[][] {
  return (
    csv
    // trim any leading or trailing line breaks
    .trim()
    .split('\n')
    .filter((row, index) => {
      return index > 0;
    })
    .map(row => {
      return row.split(delimiter);
    })
  );
}