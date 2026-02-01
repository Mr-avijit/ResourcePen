module.exports = {
  provider: process.env.STORAGE_PROVIDER || 'local', // local, s3, gcp
  localPath: 'storage/uploads',
  s3: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET
  }
};