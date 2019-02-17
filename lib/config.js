module.exports.config = {
  allowType: ['jpg', 'jpeg', 'png'],
  sourceBucket: null,
  sourcePrefix: null,
  sourceSuffix: null,
  destinationBucket: null,
  metadata: {},
  all: {
    fileName: null,
    type: null,
    quality: 70,
    acl: 'public-read', // 'private'
  },
  outputs: [
    {
      width: 300,
      height: null,
      prefix: null,
      suffix: '300',
    },
    {
      width: 450,
      height: null,
      prefix: null,
      suffix: '450',
    },
    {
      width: 900,
      height: null,
      prefix: null,
      suffix: '900',
    },
  ],
};
