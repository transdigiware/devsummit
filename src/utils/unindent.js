module.exports = function(str) {
  let lines = str.split('\n');
  if (lines[0].trim() === '') {
    lines = lines.slice(1);
  }
  const numberOfSpaces = lines[0].search(/\S/);
  return lines.map(line => line.slice(numberOfSpaces)).join('\n');
};
