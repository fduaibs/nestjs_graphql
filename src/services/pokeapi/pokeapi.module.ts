import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PokeapiService } from './pokeapi.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://pokeapi.co/api/v2',
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [PokeapiService],
  exports: [PokeapiService],
})
export class PokeapiModule {}
