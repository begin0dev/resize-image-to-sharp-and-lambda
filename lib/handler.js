const { imageProcessor } = require('./imageProcessor');

module.exports.lambdaResized = async ({ Records: records }, context, callback) => {
  try {
    await Promise.all(records.map(imageProcessor));
    callback(null);
  } catch (err) {
    console.error(err);
    callback(err, { records });
  }
};
