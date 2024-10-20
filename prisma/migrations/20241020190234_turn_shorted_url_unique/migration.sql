/*
  Warnings:

  - A unique constraint covering the columns `[shortnedUrlPath]` on the table `UrlShortener` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UrlShortener_shortnedUrlPath_key" ON "UrlShortener"("shortnedUrlPath");
