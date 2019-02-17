const AWS = require('aws-sdk');

const s3Manager = new AWS.S3({ apiVersion: '2006-03-01' });

module.exports.getObject = (bucket, key) => {
  return new Promise(async (resolve) => {
    try {
      console.log(`Downloading: ${key}`);
      const payload = await s3Manager.getObject({
        Bucket: bucket,
        Key: key,
      }).promise();
      resolve(payload);
    } catch (err) {
      console.error('S3 getObject failed');
      throw err;
    }
  });
};

module.exports.putObject = (param) => {
  return new Promise(async (resolve) => {
    try {
      console.log(`Uploading: ${param.Key}`);
      const payload = await s3Manager.putObject(param).promise();
      resolve(payload);
    } catch (err) {
      console.error('S3 putObject failed');
      throw err;
    }
  });
};
