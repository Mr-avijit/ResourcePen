import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    awsBucket: process.env.AWS_BUCKET,
}));
