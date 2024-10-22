import ShortenedUrl from "./shortened-url.entity"
import UrlAccess from "./url-access.entity";

export default interface IShortenedUrlRepository {
  findByShortenedUrlPath(shortenedUrlPath: string) : Promise<ShortenedUrl>;
  findAllByUserId(userId: number) : Promise<ShortenedUrl[]>;
  create({sourceUrl, shortenedUrlPath, userId}) : Promise<ShortenedUrl>;
  update({id, sourceUrl}) : Promise<ShortenedUrl>;
  delete(id: number): Promise<void>;
  urlAccessRecord(shortenedUrlId: number): Promise<UrlAccess>
}