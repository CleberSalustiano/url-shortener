import ShortenedUrl from "./shortenedUrl"
import UrlAccess from "./urlAccess";

export default interface IShortenedUrlRepository {
  findByShortenedUrlPath(shortenedUrlPath: string) : Promise<ShortenedUrl>;
  findAllByUserId(userId: number) : Promise<ShortenedUrl[]>;
  create({sourceUrl, shortenedUrlPath, userId}) : Promise<ShortenedUrl>;
  update({id, sourceUrl}) : Promise<ShortenedUrl>;
  delete(id: number): Promise<void>;
  urlAccessRecord(shortenedUrlId: number): Promise<UrlAccess>
}