import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../domain/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppError } from '../../../shared/errors/domain/app.error';
import IUserRepository from '../../../modules/user/domain/user.repository.interface';
import * as argon2 from 'argon2';
import { ILoginUserDTO } from '../domain/auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUserRepository = {
    findByLogin: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = jest.mocked(module.get<IUserRepository>('IUserRepository'));
    jwtService = jest.mocked(module.get<JwtService>(JwtService));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password successfully', async () => {
    const password = 'plainpassword';
    const hashedPassword = 'hashedpassword';

    jest.spyOn(argon2, 'hash').mockResolvedValue(hashedPassword);

    const result = await service.hashPassword(password);

    expect(result).toBe(hashedPassword);
    expect(argon2.hash).toHaveBeenCalledWith(password, {
      secret: expect.any(Buffer),
      type: argon2.argon2id,
    });
  });

  it('should throw an error when hashing the password fails', async () => {
    const password = 'plainpassword';
    
    jest.spyOn(argon2, 'hash').mockRejectedValue(new Error('Hashing error'));

    await expect(service.hashPassword(password)).rejects.toThrow(AppError);
    await expect(service.hashPassword(password)).rejects.toThrow('Erro ao criptografar a senha');
  });

  it('should validate the password successfully', async () => {
    const password = 'plainpassword';
    const hashedPassword = 'hashedpassword';

    jest.spyOn(argon2, 'verify').mockResolvedValue(true);

    const result = await service.validatePassword(password, hashedPassword);

    expect(result).toBe(true);
    expect(argon2.verify).toHaveBeenCalledWith(hashedPassword, password, {
      secret: expect.any(Buffer),
    });
  });

  it('should throw an error when validating the password fails', async () => {
    const password = 'plainpassword';
    const hashedPassword = 'hashedpassword';

    jest.spyOn(argon2, 'verify').mockRejectedValue(new Error('Validation error'));

    await expect(service.validatePassword(password, hashedPassword)).rejects.toThrow(AppError);
    await expect(service.validatePassword(password, hashedPassword)).rejects.toThrow('Erro ao validar a senha');
  });

  it('should login successfully', async () => {
    const dto: ILoginUserDTO = {
      login: 'testuser',
      password: 'plainpassword',
    };

    const user = {
      id: 1,
      login: "user",
      password: 'hashedpassword',
    };

    userRepository.findByLogin.mockResolvedValue(user);
    jest.spyOn(argon2, 'verify').mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('access_token');

    const result = await service.login(dto);

    expect(result).toEqual({ access_token: 'access_token' });
    expect(userRepository.findByLogin).toHaveBeenCalledWith(dto.login);
    expect(argon2.verify).toHaveBeenCalledWith(user.password, dto.password, {
      secret: expect.any(Buffer),
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({ id: user.id });
  });

  it('should throw an error if login credentials are invalid', async () => {
    const dto: ILoginUserDTO = {
      login: 'testuser',
      password: 'plainpassword',
    };

    userRepository.findByLogin.mockResolvedValue(null);

    await expect(service.login(dto)).rejects.toThrow(AppError);
    await expect(service.login(dto)).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('should throw an error if password is invalid', async () => {
    const dto: ILoginUserDTO = {
      login: 'testuser',
      password: 'plainpassword',
    };

    const user = {
      id: 1,
      login: "user",
      password: 'hashedpassword',
    };

    userRepository.findByLogin.mockResolvedValue(user);
    jest.spyOn(argon2, 'verify').mockResolvedValue(false); // Senha inválida

    await expect(service.login(dto)).rejects.toThrow(AppError);
    await expect(service.login(dto)).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('should validate token successfully', async () => {
    const token = 'valid.token';
    const payload = { id: 1 };

    jwtService.verifyAsync.mockResolvedValue(payload);

    const result = await service.validateToken(token);

    expect(result).toEqual(payload);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
      secret: expect.any(String),
    });
  });

  it('should throw an error if token validation fails', async () => {
    const token = 'invalid.token';

    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(service.validateToken(token)).rejects.toThrow(AppError);
    await expect(service.validateToken(token)).rejects.toThrow('Token inválido');
  });
});
