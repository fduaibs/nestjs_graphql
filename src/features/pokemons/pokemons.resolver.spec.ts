import { Test, TestingModule } from '@nestjs/testing';
import { CreateOnePokemonInputDto } from './dtos/create-one-pokemon.dto';
import { DeleteOnePokemonInputDto } from './dtos/delete-one-pokemon.dto';
import { FindManyPokemonInputDto, FindManyPokemonResponseDto } from './dtos/find-many-pokemon.dto';
import { ImportPokemonByIdInputDto } from './dtos/import-pokemon-by-id.dto';
import { UpdateOnePokemonInputDto } from './dtos/update-one-pokemon.dto';
import { SortOrderEnum } from './enums/sort-order.enum';
import { Pokemon } from './pokemon.entity';
import { PokemonsResolver } from './pokemons.resolver';
import { PokemonsService } from './pokemons.service';

describe('PokemonsResolver', () => {
  let resolver: PokemonsResolver;
  let pokemonsService: PokemonsService;

  beforeEach(async () => {
    const mockPokemonsService = {
      createOnePokemon: jest.fn(),
      findManyPokemon: jest.fn(),
      updateOnePokemon: jest.fn(),
      deleteOnePokemon: jest.fn(),
      importPokemonById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsResolver, { provide: PokemonsService, useValue: mockPokemonsService }],
    }).compile();

    resolver = module.get<PokemonsResolver>(PokemonsResolver);
    pokemonsService = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createOnePokemon', () => {
    it('should create a new Pokemon', async () => {
      const createDto: CreateOnePokemonInputDto = { name: 'Pikachu', type: 'Electric' };
      const mockPokemon: Pokemon = { ...createDto, id: 1, created_at: '2025-03-26 06:29:20', updated_at: '2025-03-26 06:29:20' };

      jest.spyOn(pokemonsService, 'createOnePokemon').mockResolvedValue(mockPokemon);

      const result = await resolver.createOnePokemon(createDto);

      expect(pokemonsService.createOnePokemon).toHaveBeenCalledWith(createDto.name, createDto.type);
      expect(result).toEqual(mockPokemon);
    });
  });

  describe('findManyPokemon', () => {
    it('should return a list of Pokemons with pagination', async () => {
      const findDto: FindManyPokemonInputDto = {
        page: 1,
        limit: 10,
        sortField: 'name',
        sortOrder: SortOrderEnum.ASC,
        name: 'Pikachu',
        type: 'Electric',
      };

      const mockResponse: FindManyPokemonResponseDto = {
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
        pokemons: [{ id: 1, name: 'pikachu', type: 'electric', created_at: '2025-03-26 06:29:20', updated_at: '2025-03-26 06:29:20' }],
      };

      jest.spyOn(pokemonsService, 'findManyPokemon').mockResolvedValue(mockResponse);

      const result = await resolver.findManyPokemon(findDto);

      expect(pokemonsService.findManyPokemon).toHaveBeenCalledWith(
        findDto.page,
        findDto.limit,
        findDto.sortField,
        findDto.sortOrder,
        findDto.name,
        findDto.type,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateOnePokemon', () => {
    it('should update an existing Pokemon', async () => {
      const updateDto: UpdateOnePokemonInputDto = { id: 1, name: 'Pikachu', type: 'Electric' };
      const mockUpdatedPokemon: Pokemon = { id: 1, name: 'pikachu', type: 'electric', created_at: '2025-03-26 06:29:20', updated_at: '2025-03-26 06:29:20' };

      jest.spyOn(pokemonsService, 'updateOnePokemon').mockResolvedValue(mockUpdatedPokemon);

      const result = await resolver.updateOnePokemon(updateDto);

      expect(pokemonsService.updateOnePokemon).toHaveBeenCalledWith(updateDto.id, updateDto.name, updateDto.type);
      expect(result).toEqual(mockUpdatedPokemon);
    });
  });

  describe('deleteOnePokemon', () => {
    it('should delete a Pokemon', async () => {
      const deleteDto: DeleteOnePokemonInputDto = { id: 1 };
      const mockDeleteResponse = true;

      jest.spyOn(pokemonsService, 'deleteOnePokemon').mockResolvedValue(mockDeleteResponse);

      const result = await resolver.deleteOnePokemon(deleteDto);

      expect(pokemonsService.deleteOnePokemon).toHaveBeenCalledWith(deleteDto.id);
      expect(result).toBe(mockDeleteResponse);
    });
  });

  describe('importPokemonById', () => {
    it('should import a Pokemon by ID', async () => {
      const importDto: ImportPokemonByIdInputDto = { id: 1 };
      const mockImportedPokemon: Pokemon = { id: 1, name: 'pikachu', type: 'electric', created_at: '2025-03-26 06:29:20', updated_at: '2025-03-26 06:29:20' };

      jest.spyOn(pokemonsService, 'importPokemonById').mockResolvedValue(mockImportedPokemon);

      const result = await resolver.importPokemonById(importDto);

      expect(pokemonsService.importPokemonById).toHaveBeenCalledWith(importDto.id);
      expect(result).toEqual(mockImportedPokemon);
    });
  });
});
