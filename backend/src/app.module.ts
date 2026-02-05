import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Configs
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import redisConfig from './config/redis.config';
import paymentConfig from './config/payment.config';
import storageConfig from './config/storage.config';
import seoConfig from './config/seo.config';

// Core
import { DatabaseModule } from './database/database.module';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RbacModule } from './rbac/rbac.module';
import { ProductsModule } from './products/products.module';
import { OnboardingModule } from './product-onboarding/onboarding.module';
import { CmsModule } from './cms/cms.module';
import { SeoModule } from './seo/seo.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ReferralModule } from './referral/referral.module';
import { RewardsModule } from './rewards/rewards.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { LogsModule } from './logs/logs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SearchModule } from './search/search.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                appConfig,
                databaseConfig,
                authConfig,
                redisConfig,
                paymentConfig,
                storageConfig,
                seoConfig,
            ],
        }),
        DatabaseModule,
        AuthModule,
        UsersModule,
        RbacModule,
        ProductsModule,
        OnboardingModule,
        CmsModule,
        SeoModule,
        CartModule,
        OrdersModule,
        PaymentsModule,
        ReviewsModule,
        EnquiriesModule,
        FeedbackModule,
        ReferralModule,
        RewardsModule,
        AnalyticsModule,
        LogsModule,
        NotificationsModule,
        SearchModule,
        HealthModule,
    ],
})
export class AppModule { }
