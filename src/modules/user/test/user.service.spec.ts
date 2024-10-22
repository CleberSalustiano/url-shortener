import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../shared/auth/domain/auth.service';
import { AppError } from '../../../shared/errors/domain/app.error';
import { UserService } from '../domain/user.service';
import IUserRepository from '../domain/user.repository.interface';
import { ICreateUserDTO } from '../domain/user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<IUserRepository>;
  let authService: jest.Mocked<AuthService>;

  const mockUserRepository = {
    create: jest.fn(),
    findByLogin: jest.fn(),
  };

  const mockAuthService = {
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = jest.mocked(module.get<IUserRepository>('IUserRepository'));
    authService = jest.mocked(module.get<AuthService>(AuthService));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a user', async () => {
    const dto: ICreateUserDTO = {
      name: 'Test User',
      login: 'testuser',
      password: 'plainpassword',
    };

    const hashedPassword = 'hashedpassword';

    authService.hashPassword.mockResolvedValue(hashedPassword);
    repository.create.mockResolvedValue({ ...dto, password: hashedPassword });

    const result = await service.createUser(dto);

    expect(repository.create).toHaveBeenCalledWith({ ...dto, password: hashedPassword });
    expect(result).toEqual({ name: 'Test User', login: 'testuser' });
  });

  it('should throw an error if required fields are not provided', async () => {
    const dto: ICreateUserDTO = {
      name: '',
      login: '',
      password: '',
    };

    await expect(service.createUser(dto)).rejects.toThrow(AppError);
    await expect(service.createUser(dto)).rejects.toThrow('Informe os valores obrigatórios!');
  });

  it('should throw an error if the login already exists', async () => {
    const dto: ICreateUserDTO = {
      name: 'Test User',
      login: 'testuser',
      password: 'plainpassword',
    };

    const hashedPassword = 'hashedpassword';

    authService.hashPassword.mockResolvedValue(hashedPassword);
    repository.create.mockRejectedValue(new Error('login already exists'));

    await expect(service.createUser(dto)).rejects.toThrow(AppError);
    await expect(service.createUser(dto)).rejects.toThrow('Esse login já existe');
  });

  it('should throw a generic error in case of an internal server error', async () => {
    const dto: ICreateUserDTO = {
      name: 'Test User',
      login: 'testuser',
      password: 'plainpassword',
    };

    const hashedPassword = 'hashedpassword';

    authService.hashPassword.mockResolvedValue(hashedPassword);
    repository.create.mockRejectedValue(new Error('Some other error'));

    await expect(service.createUser(dto)).rejects.toThrow('Internal Server Error');
  });

  it('should find a user by login', async () => {
    const login = 'testuser';
    const mockUser = { id: 1, name: 'Test User', login };

    repository.findByLogin.mockResolvedValue(mockUser);

    const result = await service.findUserByLogin(login);

    expect(result).toEqual(mockUser);
    expect(repository.findByLogin).toHaveBeenCalledWith(login);
  });
});
