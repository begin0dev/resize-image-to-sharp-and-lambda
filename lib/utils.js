const path = require('path');

module.exports.validateSourcePrefix = (sourcePrefix, key) => {
  if (!sourcePrefix) return false;
  const prefixByKey = key && key.split('/').shift();
  return sourcePrefix !== prefixByKey;
};

module.exports.validateSourceSuffix = (sourceSuffix, key) => {
  if (!sourceSuffix) return false;
  if (Array.isArray(sourceSuffix) && sourceSuffix.length === 0) return false;

  const suffixByKey = key && key.split('.').pop();
  return sourceSuffix !== suffixByKey || sourceSuffix.indexOf(suffixByKey) === -1;
};

module.exports.decodeS3EventKey = (key) => {
  return decodeURIComponent(key.replace(/\+/g, ' '));
};

module.exports.makeFileName = (fileName, prefix, suffix) => {
  let resultName = fileName;
  if (prefix) resultName = path.join(prefix, fileName);
  if (suffix) {
    resultName = `${resultName.slice(0, resultName.lastIndexOf('.'))}.${suffix}`;
  }
  return resultName;
};

module.exports.generateSharpFunc = (key, type, { all, outputs }) => (
  outputs.map((output) => {
    const func = [];
    const outType = output.type || all.type;
    const quality = output.quality || all.quality;

    if (outType || quality) {
      func.push(['toFormat', outType || type.split('/')[1], { quality }]);
    }
    if (output.width || output.height) {
      const { width, height, position, fit } = output;
      const resize = { width, height, position, fit };
      Object.keys(resize).forEach((k) => { if (!resize[k]) delete resize[k]; });
      func.push(['resize', resize]);
    }
    return func;
  })
);
