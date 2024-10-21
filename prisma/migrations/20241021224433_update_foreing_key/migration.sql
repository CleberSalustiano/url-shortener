/*
  Warnings:

  - You are about to drop the column `urlShortenerId` on the `url_access` table. All the data in the column will be lost.
  - Added the required column `shortenedUrlId` to the `url_access` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_url_access" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortenedUrlId" INTEGER NOT NULL,
    "urlAccess" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "url_access_shortenedUrlId_fkey" FOREIGN KEY ("shortenedUrlId") REFERENCES "shortened_url" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_url_access" ("id", "urlAccess") SELECT "id", "urlAccess" FROM "url_access";
DROP TABLE "url_access";
ALTER TABLE "new_url_access" RENAME TO "url_access";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
