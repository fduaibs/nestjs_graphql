import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokeapiModule } from '../../services/pokeapi/pokeapi.module';
import { Pokemon } from './pokemon.entity';
import { PokemonsResolver } from './pokemons.resolver';
import { PokemonsService } from './pokemons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon]), PokeapiModule],
  providers: [PokemonsResolver, PokemonsService],
})
export class PokemonsModule {}
