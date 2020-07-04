module.exports = {
  name: 'toast',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/toast',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
