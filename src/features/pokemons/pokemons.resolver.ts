import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOnePokemonInputDto } from './dtos/create-one-pokemon.dto';
import { DeleteOnePokemonInputDto } from './dtos/delete-one-pokemon.dto';
import { FindManyPokemonInputDto, FindManyPokemonResponseDto } from './dtos/find-many-pokemon.dto';
import { ImportPokemonByIdInputDto } from './dtos/import-pokemon-by-id.dto';
import { UpdateOnePokemonInputDto } from './dtos/update-one-pokemon.dto';
import { Pokemon } from './pokemon.entity';
import { PokemonsService } from './pokemons.service';

@Resolver('Pokemons')
export class PokemonsResolver {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Mutation(() => Pokemon)
  async createOnePokemon(@Args('createPokemonInputDto') createPokemonInputDto: CreateOnePokemonInputDto): Promise<Pokemon> {
    return this.pokemonsService.createOnePokemon(createPokemonInputDto.name, createPokemonInputDto.type);
  }

  @Query(() => FindManyPokemonResponseDto)
  findManyPokemon(@Args('findManyPokemonInputDto') findManyPokemonInputDto: FindManyPokemonInputDto): Promise<FindManyPokemonResponseDto> {
    const { page, limit, sortField, sortOrder, name, type } = findManyPokemonInputDto;

    return this.pokemonsService.findManyPokemon(page, limit, sortField, sortOrder, name, type);
  }

  @Mutation(() => Pokemon)
  async updateOnePokemon(@Args('updateOnePokemonInputDto') updateOnePokemonInputDto: UpdateOnePokemonInputDto): Promise<Pokemon> {
    const { id, name, type } = updateOnePokemonInputDto;

    return this.pokemonsService.updateOnePokemon(id, name, type);
  }

  @Mutation(() => Boolean)
  async deleteOnePokemon(@Args('deleteOnePokemonInputDto') deleteOnePokemonInputDto: DeleteOnePokemonInputDto): Promise<Boolean> {
    return this.pokemonsService.deleteOnePokemon(deleteOnePokemonInputDto.id);
  }

  @Mutation(() => Pokemon)
  async importPokemonById(@Args('importPokemonByIdInputDto') importPokemonByIdInputDto: ImportPokemonByIdInputDto): Promise<Pokemon> {
    return this.pokemonsService.importPokemonById(importPokemonByIdInputDto.id);
  }
}
