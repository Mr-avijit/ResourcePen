import { registerAs } from '@nestjs/config';

export default registerAs('seo', () => ({
    meilisearchHost: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
    meilisearchKey: process.env.MEILISEARCH_KEY,
}));
