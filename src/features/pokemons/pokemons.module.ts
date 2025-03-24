import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './pokemon.entity';
import { PokemonsResolver } from './pokemons.resolver';
import { PokemonsService } from './pokemons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon])],
  providers: [PokemonsResolver, PokemonsService],
})
export class PokemonsModule {}
