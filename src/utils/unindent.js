module.exports = function(str) {
  let lines = str.split('\n');
  if (lines[0].trim() === '') {
    lines = lines.slice(1);
  }
  const numberOfSpaces = lines[0].search(/\S/);
  // This is an awkward hack to trim leading whitespace,
  // but at most numberOfSpaces.
  return lines
    .map(
      line => line.slice(0, numberOfSpaces).trim() + line.slice(numberOfSpaces),
    )
    .join('\n');
};
