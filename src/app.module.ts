import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { HelloModule } from './features/hello/hello.module';
import { PokemonsModule } from './features/pokemons/pokemons.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
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
    HelloModule,
    PokemonsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
