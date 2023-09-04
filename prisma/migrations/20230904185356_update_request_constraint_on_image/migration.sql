/*
  Warnings:

  - Added the required column `filename` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageRef" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    CONSTRAINT "Image_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "imageRef", "requestId", "type") SELECT "id", "imageRef", "requestId", "type" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_imageRef_key" ON "Image"("imageRef");
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "faceCount" INTEGER,
    "Status" TEXT NOT NULL DEFAULT 'NEW'
);
INSERT INTO "new_Request" ("Status", "createdAt", "faceCount", "id", "name", "updatedAt", "userId") SELECT "Status", "createdAt", "faceCount", "id", "name", "updatedAt", "userId" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE UNIQUE INDEX "Request_name_key" ON "Request"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
