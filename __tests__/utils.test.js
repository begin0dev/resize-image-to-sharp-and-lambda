const { makeFileName, generateSharpFunc } = require('../lib/utils');

describe('makeFileName', () => {
  const prefix = 'prefix';
  const fileName = 'image.png';
  const suffix = 'suffix';

  test('Passing only fileName', () => {
    expect(makeFileName(fileName)).toEqual(fileName);
  });
  test('Passing with prefix', () => {
    expect(makeFileName(fileName, prefix)).toEqual(`${prefix}/${fileName}`);
  });
  test('Passing with suffix', () => {
    expect(makeFileName(fileName, null, suffix)).toEqual('image.suffix');
  });
  test('Passing with all arguments', () => {
    expect(makeFileName(fileName, prefix, suffix)).toEqual('prefix/image.suffix');
  });
});

describe('generateSharpFunc', () => {
  const type = 'image/jpeg';
  const key = 'test_image.jpeg';

  test('Passing all', () => {
    const config = {
      all: {
        quality: 70,
      },
      outputs: [
        {
          width: 300,
          height: null,
          prefix: 'test',
          suffix: '300',
        },
      ],
    };
    const funcs = generateSharpFunc(key, type, config);
    expect(funcs.length).toEqual(1);
    const funcNames = funcs[0].map(v => v[0]);
    expect(funcNames.includes('toFormat')).toBeTruthy();
    expect(funcNames.includes('resize')).toBeTruthy();
    funcs[0].forEach((func) => {
      if (func[0] === 'toFormat') {
        expect(func.length).toEqual(3);
      }
      if (func[0] === 'resize') {
        expect(typeof func[1]).toEqual('object');
        const keys = Object.keys(func[1]);
        expect(keys.length).toEqual(1);
        expect(keys.includes('width')).toBeTruthy();
      }
    });
  });
});
