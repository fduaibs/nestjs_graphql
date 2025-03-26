import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PokeapiService } from './pokeapi.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('POKEAPI_BASE_URL'),
        timeout: configService.get('POKEAPI_TIMEOUT'),
        maxRedirects: configService.get('POKEAPI_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PokeapiService],
  exports: [PokeapiService],
})
export class PokeapiModule {}
