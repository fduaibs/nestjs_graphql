import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GraphqlThrottlerGuard } from './common/guards/graphql-throttler.guard';
import { HelloModule } from './features/hello/hello.module';
import { PokemonsModule } from './features/pokemons/pokemons.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        driver: ApolloDriver,
        context: ({ req, res }) => ({ req, res }),
        typePaths: ['./**/*.graphql'],
        playground: false,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault(),
          ApolloServerPluginCacheControl({
            defaultMaxAge: configService.get('APOLLO_CACHE_DEFAULT_MAX_AGE'),
            calculateHttpHeaders: configService.get('APOLLO_CACHE_CALCULATE_HTTP_HEADERS'),
          }),
          responseCachePlugin(),
        ],
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/common/database/database_orm.sqlite',
      migrations: [__dirname + '/common/typeorm/migrations/*.ts'],
      autoLoadEntities: true,
      synchronize: false,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('THROTTLE_TTL'),
          limit: configService.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    HelloModule,
    PokemonsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GraphqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
