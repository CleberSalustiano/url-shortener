/*
  Warnings:

  - You are about to drop the `UrlShortener` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UrlShortener";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "url_shortener" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceUrl" TEXT NOT NULL,
    "shortnedUrlPath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" INTEGER,
    CONSTRAINT "url_shortener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "url_shortener_shortnedUrlPath_key" ON "url_shortener"("shortnedUrlPath");
