import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, res }) => ({ req, res }),
      typePaths: ['./**/*.graphql'],
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/common/database/database_orm.sqlite',
      migrations: [__dirname + '/common/typeorm/migrations/*.ts'],
      autoLoadEntities: true,
      synchronize: false,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 2,
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
