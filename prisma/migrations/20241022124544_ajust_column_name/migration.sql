/*
  Warnings:

  - You are about to drop the column `shortnedUrlPath` on the `shortened_url` table. All the data in the column will be lost.
  - Added the required column `shortenedUrlPath` to the `shortened_url` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_shortened_url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceUrl" TEXT NOT NULL,
    "shortenedUrlPath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" INTEGER,
    CONSTRAINT "shortened_url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_shortened_url" ("createdAt", "deletedAt", "id", "sourceUrl", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "sourceUrl", "updatedAt", "userId" FROM "shortened_url";
DROP TABLE "shortened_url";
ALTER TABLE "new_shortened_url" RENAME TO "shortened_url";
CREATE UNIQUE INDEX "shortened_url_shortenedUrlPath_key" ON "shortened_url"("shortenedUrlPath");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
