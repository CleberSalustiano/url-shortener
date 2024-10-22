import { Test, TestingModule } from '@nestjs/testing';
import { AppError } from '../../../shared/errors/domain/app.error';
import { ShortenerService } from '../domain/shortener.service';
import IShortenedUrlRepository from '../domain/shortened-url.repository.interface';

describe('ShortenerService', () => {
  let service: ShortenerService;
  let repository: jest.Mocked<IShortenedUrlRepository>;

  const mockShortenedUrlRepository = {
    findByShortenedUrlPath: jest.fn(),
    findAllByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    urlAccessRecord: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenerService,
        {
          provide: 'IShortenedUrlRepository',
          useValue: mockShortenedUrlRepository,
        },
      ],
    }).compile();

    service = module.get<ShortenerService>(ShortenerService);
    repository = jest.mocked(
      module.get<IShortenedUrlRepository>('IShortenedUrlRepository'),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a shortened URL', async () => {
    repository.findByShortenedUrlPath.mockResolvedValueOnce(null);

    const result = await service.createShortUrl('https://example.com', 1);

    expect(repository.findByShortenedUrlPath).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith({
      sourceUrl: 'https://example.com',
      shortenedUrlPath: expect.stringMatching(/^[a-zA-Z0-9]{6}$/),
      userId: 1,
    });
    expect(result).toHaveLength(6);
  });

  it('should throw an error if the original URL is not provided', async () => {
    await expect(service.createShortUrl('', 1)).rejects.toThrow(AppError);
  });

  it('should return the original URL from the shortened path', async () => {
    const mockShortenedUrl = {
      id: 1,
      sourceUrl: 'https://example.com',
      shortenedUrlPath: 'abc123',
    };
    repository.findByShortenedUrlPath.mockResolvedValue(mockShortenedUrl);

    const result = await service.findSourceUrl('abc123');

    expect(result).toEqual(mockShortenedUrl);
  });

  it('should throw an error if the shortened path does not exist', async () => {
    repository.findByShortenedUrlPath.mockResolvedValue(null);

    await expect(service.findSourceUrl('invalid')).rejects.toThrow(AppError);
  });

  it('should return all URLs for a user', async () => {
    const mockUrls = [
      { id: 1, shortenedUrlPath: 'abc123', sourceUrl: 'https://example.com' },
    ];
    repository.findAllByUserId.mockResolvedValue(mockUrls);

    const result = await service.findAllByUserId(1);

    expect(result).toEqual(mockUrls);
  });

  it('should throw an error when trying to fetch URLs without the user ID', async () => {
    await expect(service.findAllByUserId(null)).rejects.toThrow(AppError);
  });

  it('should successfully update the original URL', async () => {
    const updatedUrl = {
      id: 1,
      sourceUrl: 'https://new.com',
      shortenedUrlPath: 'abc123',
    };
    repository.update.mockResolvedValue(updatedUrl);

    const result = await service.updateSourceUrl('https://new.com', 1);

    expect(result).toEqual(updatedUrl);
  });

  it('should throw an error if the ID or the original URL are not provided during the update', async () => {
    await expect(service.updateSourceUrl('', 1)).rejects.toThrow(AppError);
    await expect(
      service.updateSourceUrl('https://new.com', null),
    ).rejects.toThrow(AppError);
  });

  it('should successfully delete a URL', async () => {
    repository.delete.mockResolvedValue(undefined);

    const result = await service.deleteSourceUrl(1);

    expect(result).toEqual('Url deletada com sucesso!');
  });

  it('should throw an error when deleting a URL without an ID', async () => {
    await expect(service.deleteSourceUrl(null)).rejects.toThrow(AppError);
  });

  it('should successfully record access to a URL', async () => {
    const mockAccess = { id: 1, shortenedUrlId: 1, urlAccess: new Date() };
    repository.urlAccessRecord.mockResolvedValue(mockAccess);

    const result = await service.urlAccessRecord(1);

    expect(result).toEqual(mockAccess);
  });

  it('should throw an error when recording access without the URL ID', async () => {
    await expect(service.urlAccessRecord(null)).rejects.toThrow(AppError);
  });
});
