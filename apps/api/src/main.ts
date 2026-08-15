import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const config = app.get(ConfigService);
  const webUrl = config.get<string>('WEB_URL', 'http://localhost:3000');
  const apiPort = config.get<number>('API_PORT', 3001);
  const nodeEnv = config.get<string>('NODE_ENV', 'development');
  const additionalOrigins = config.get<string>('ADDITIONAL_CORS_ORIGINS', '');

  const allowedOrigins = [webUrl, ...additionalOrigins.split(',').filter(Boolean)];

  // ── Security ──────────────────────────────────────────────
  app.use(
    (helmet as any).default({
      contentSecurityPolicy: nodeEnv === 'production',
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin) and allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true, // required for httpOnly refresh token cookie
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.use(cookieParser());
  app.use(compression());

  // ── API Versioning ─────────────────────────────────────────
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // ── Global Pipes / Filters / Interceptors ──────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown props
      forbidNonWhitelisted: true, // error on unknown props
      transform: true, // auto-transform types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // ── Swagger (development + staging only) ───────────────────
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Mushroom Marketplace API')
      .setDescription(
        'Production-ready API connecting mushroom growers with buyers. All endpoints require authentication unless marked public.',
      )
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .addTag('auth', 'Authentication & session management')
      .addTag('users', 'User profiles and account management')
      .addTag('farms', 'Grower farm profiles')
      .addTag('businesses', 'B2B buyer business profiles')
      .addTag('mushrooms', 'Mushroom catalog (categories & types)')
      .addTag('listings', 'Mushroom supply listings')
      .addTag('requirements', 'Buyer requirement posts')
      .addTag('offers', 'Grower offers on requirements')
      .addTag('orders', 'Order management and state transitions')
      .addTag('payments', 'Razorpay payment integration')
      .addTag('messages', 'Buyer-grower messaging')
      .addTag('reviews', 'Post-transaction reviews')
      .addTag('favorites', 'Saved growers, listings & requirements')
      .addTag('notifications', 'In-app notifications')
      .addTag('disputes', 'Order dispute management')
      .addTag('admin', 'Admin panel endpoints')
      .addTag('search', 'Unified marketplace search')
      .addTag('health', 'Service health checks')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    console.log(`📚 Swagger docs: http://localhost:${apiPort}/api/docs`);
  }

  // ── Request Size Limits ────────────────────────────────────
  app.use((req: any, _res: any, next: any) => {
    req.rawBody = '';
    req.on('data', (chunk: any) => {
      req.rawBody += chunk;
    });
    next();
  });

  await app.listen(apiPort, '0.0.0.0');

  console.log(`🚀 API running on: http://localhost:${apiPort}`);
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`🌐 CORS allowed for: ${allowedOrigins.join(', ')}`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
