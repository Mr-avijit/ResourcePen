import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    env: process.env.APP_ENV || 'development',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    url: process.env.APP_URL || 'http://localhost:3000',
}));
