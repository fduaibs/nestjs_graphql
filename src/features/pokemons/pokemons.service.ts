import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PokeapiService } from '../../services/pokeapi/pokeapi.service';
import { FindManyPokemonResponseDto } from './dtos/find-many-pokemon.dto';
import { SortOrderEnum } from './enums/sort-order.enum';
import { Pokemon } from './pokemon.entity';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonsRepository: Repository<Pokemon>,
    private readonly pokeapiService: PokeapiService,
  ) {}

  async createOnePokemon(name: string, type: string): Promise<Pokemon> {
    const createdPokemon = this.pokemonsRepository.create({ name, type });

    return await this.pokemonsRepository.save(createdPokemon);
  }

  async updateOnePokemon(id: number, name?: string, type?: string): Promise<Pokemon> {
    const foundPokemon = await this.pokemonsRepository.findOneByOrFail({ id: id });

    const mergedPokemon = this.pokemonsRepository.merge(foundPokemon, { name, type });

    return await this.pokemonsRepository.save(mergedPokemon);
  }

  async deleteOnePokemon(id: number): Promise<Boolean> {
    const deletedData = await this.pokemonsRepository.delete(id);

    return deletedData.affected === 1;
  }

  async findManyPokemon(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: SortOrderEnum,
    name?: string,
    type?: string,
  ): Promise<FindManyPokemonResponseDto> {
    const skip = (page - 1) * limit;

    const where = {
      ...(name && { name: Like(`%${name}%`) }),
      ...(type && { type: Like(`%${type}%`) }),
    };

    const [pokemonsFound, totalCount] = await this.pokemonsRepository.findAndCount({
      skip,
      take: limit,
      order: { [sortField]: sortOrder },
      where,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return { totalCount, totalPages: totalPages, currentPage: page, pokemons: pokemonsFound };
  }

  async importPokemonById(id: number) {
    const fetchedPokemon = await this.pokeapiService.getPokemonById(id);

    const name = fetchedPokemon.name;

    const type = fetchedPokemon.types[0].type.name;

    const foundPokemon = await this.pokemonsRepository.findOneBy({ id: id });

    if (foundPokemon) {
      const mergedPokemon = this.pokemonsRepository.merge(foundPokemon, { name, type });

      return await this.pokemonsRepository.save(mergedPokemon);
    }

    const createdPokemon = this.pokemonsRepository.create({ id, name, type });

    return await this.pokemonsRepository.save(createdPokemon);
  }
}
