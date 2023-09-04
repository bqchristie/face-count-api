-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageRef" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    CONSTRAINT "Image_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "imageRef", "requestId", "type") SELECT "id", "imageRef", "requestId", "type" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_imageRef_key" ON "Image"("imageRef");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
