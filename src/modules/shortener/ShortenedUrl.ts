export class ShortenedUrl {
  id: number;
  sourceUrl: string;
  shortnedUrlPath: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  userId: number;
  count?: number;
}