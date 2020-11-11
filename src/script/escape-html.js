const map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

const mapRe = new RegExp(`[${Object.keys(map).join('')}]`, 'g');
const safeStrs = new WeakSet();

function escape(text) {
  return text.replace(mapRe, m => map[m]);
}

module.exports.escape = escape;

function safe(str) {
  const strObj = new String(str);
  safeStrs.add(strObj);
  return strObj;
}

module.exports.safe = safe;

function html(parts, ...subs) {
  return safe(
    parts
      .map((part, i) => {
        if (i === 0) return part;
        let sub = subs[i - 1];

        // Normalise to array to handle mapping through arrays
        if (!Array.isArray(sub)) {
          sub = [sub];
        }

        const processedSub = sub
          .map(sub => {
            if (sub === undefined) return 'undefined';
            if (sub === null) return 'null';
            if (safeStrs.has(sub)) return sub.toString();
            return escape(
              sub.toString
                ? sub.toString()
                : Object.prototype.toString.call(sub),
            );
          })
          .join('');

        return processedSub + part;
      })
      .join(''),
  );
}

module.exports.html = html;
