/*
  Warnings:

  - You are about to drop the `url_shortener` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "url_shortener_shortnedUrlPath_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "url_shortener";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "shortened_url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceUrl" TEXT NOT NULL,
    "shortnedUrlPath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" INTEGER,
    CONSTRAINT "shortened_url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_url_access" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "urlShortenerId" INTEGER NOT NULL,
    "urlAccess" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "url_access_urlShortenerId_fkey" FOREIGN KEY ("urlShortenerId") REFERENCES "shortened_url" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_url_access" ("id", "urlAccess", "urlShortenerId") SELECT "id", "urlAccess", "urlShortenerId" FROM "url_access";
DROP TABLE "url_access";
ALTER TABLE "new_url_access" RENAME TO "url_access";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "shortened_url_shortnedUrlPath_key" ON "shortened_url"("shortnedUrlPath");
