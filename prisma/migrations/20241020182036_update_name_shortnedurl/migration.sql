/*
  Warnings:

  - You are about to drop the column `shortnedUrl` on the `UrlShortener` table. All the data in the column will be lost.
  - Added the required column `shortnedUrlPath` to the `UrlShortener` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UrlShortener" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceUrl" TEXT NOT NULL,
    "shortnedUrlPath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_UrlShortener" ("createdAt", "deletedAt", "id", "sourceUrl", "updatedAt") SELECT "createdAt", "deletedAt", "id", "sourceUrl", "updatedAt" FROM "UrlShortener";
DROP TABLE "UrlShortener";
ALTER TABLE "new_UrlShortener" RENAME TO "UrlShortener";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
