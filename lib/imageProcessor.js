// event sample
// {
//   "Records": [
//     {
//       "eventVersion": "2.0",
//       "eventTime": "1970-01-01T00:00:00.000Z",
//       "requestParameters": {
//         "sourceIPAddress": "127.0.0.1"
//       },
//       "s3": {
//         "configurationId": "testConfigRule",
//         "object": {
//           "eTag": "0123456789abcdef0123456789abcdef",
//           "sequencer": "0A1B2C3D4E5F678901",
//           "key": "HappyFace.jpg",
//           "size": 1024
//         },
//         "bucket": {
//           "arn": bucketarn,
//           "name": "sourcebucket",
//           "ownerIdentity": {
//             "principalId": "EXAMPLE"
//           }
//         },
//         "s3SchemaVersion": "1.0"
//       },
//       "responseElements": {
//         "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH",
//         "x-amz-request-id": "EXAMPLE123456789"
//       },
//       "awsRegion": "us-east-1",
//       "eventName": "ObjectCreated:Put",
//       "userIdentity": {
//         "principalId": "EXAMPLE"
//       },
//       "eventSource": "aws:s3"
//     }
//   ]
// }
const { config } = require('./config');
const { getObject, putObject } = require('./s3Manager');
const { sharpImage, resizeImage } = require('./sharpManager');
const { validateSourcePrefix, validateSourceSuffix, decodeS3EventKey, generateSharpFunc, makeFileName } = require('./utils');

const CONTENT_TYPES = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  json: 'application/json',
};

module.exports.imageProcessor = async ({
  eventName,
  eventSource,
  s3: {
    object: { key: undecodedKey },
    bucket: { name: bucketName },
  },
}) => {
  const { sourceBucket, sourcePrefix, sourceSuffix } = config;
  if (eventSource !== 'aws:s3' || eventName !== 'ObjectCreated:Put') {
    throw new TypeError('Event does not match type');
  }
  if (!undecodedKey) {
    throw new Error(`Event does not contain a valid S3 Object Key. Invoked with key: ${undecodedKey}`);
  }
  if (sourceBucket && sourceBucket !== bucketName) {
    throw new Error(`Event does not match bucket name(${bucketName})`);
  }
  if (validateSourcePrefix(sourcePrefix, undecodedKey) || validateSourceSuffix(sourceSuffix, undecodedKey)) {
    throw new Error('Event does not match source type');
  }

  try {
    const key = decodeS3EventKey(undecodedKey);
    const { Body: image, ...s3Metadata } = await getObject(bucketName, key);
    const input = await sharpImage(image);
    const outFunctions = generateSharpFunc(key, s3Metadata.ContentType, config);
    const streams = await Promise.all(outFunctions.map(functions => resizeImage(input, functions)));
    const params = streams.map((stream, index) => {
      const { destinationBucket, metadata, all, outputs } = config;
      const fileName = outputs[index].fileName || all.fileName || key;
      const prefix = outputs[index].prefix || all.prefix;
      const suffix = outputs[index].suffix || all.suffix;
      return {
        Bucket: destinationBucket || bucketName,
        Key: makeFileName(fileName, prefix, suffix),
        ContentType: CONTENT_TYPES[outputs[index].type || all.type] || s3Metadata.ContentType,
        Body: stream,
        Metadata: Object.assign({}, metadata, { 'img-processed': 'true' }),
        ACL: outputs[index].acl || all.acl || 'private',
      };
    });
    await Promise.all(params.map(param => putObject(param)));
  } catch (err) {
    console.error(err);
  }
};
