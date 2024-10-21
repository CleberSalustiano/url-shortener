/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UrlAccess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "urlShortenerId" INTEGER NOT NULL,
    "urlAccess" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UrlAccess_urlShortenerId_fkey" FOREIGN KEY ("urlShortenerId") REFERENCES "url_shortener" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");
