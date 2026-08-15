import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { BusinessesModule } from './businesses/businesses.module';
import { MushroomsModule } from './mushrooms/mushrooms.module';
import { ListingsModule } from './listings/listings.module';
import { RequirementsModule } from './requirements/requirements.module';
import { OffersModule } from './offers/offers.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DisputesModule } from './disputes/disputes.module';
import { AdminModule } from './admin/admin.module';
import { SearchModule } from './search/search.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    // ── Configuration ─────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),

    // ── Rate Limiting (Redis-backed) ───────────────────────────
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            name: 'global',
            ttl: 60000, // 1 minute
            limit: 100,
          },
          {
            name: 'auth',
            ttl: 900000, // 15 minutes
            limit: 10,
          },
        ],
      }),
    }),

    // ── Background Jobs ────────────────────────────────────────
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get<string>('REDIS_URL', 'redis://localhost:6379'),
        },
      }),
    }),

    // ── Scheduler ─────────────────────────────────────────────
    ScheduleModule.forRoot(),

    // ── Core ──────────────────────────────────────────────────
    PrismaModule,
    StorageModule,

    // ── Feature Modules ────────────────────────────────────────
    AuthModule,
    UsersModule,
    FarmsModule,
    BusinessesModule,
    MushroomsModule,
    ListingsModule,
    RequirementsModule,
    OffersModule,
    OrdersModule,
    PaymentsModule,
    MessagesModule,
    ReviewsModule,
    FavoritesModule,
    NotificationsModule,
    DisputesModule,
    AdminModule,
    SearchModule,
    AnalyticsModule,
    HealthModule,
  ],
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
