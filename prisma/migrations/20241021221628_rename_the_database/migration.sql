/*
  Warnings:

  - You are about to drop the `UrlAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UrlAccess";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "url_access" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "urlShortenerId" INTEGER NOT NULL,
    "urlAccess" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "url_access_urlShortenerId_fkey" FOREIGN KEY ("urlShortenerId") REFERENCES "url_shortener" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
