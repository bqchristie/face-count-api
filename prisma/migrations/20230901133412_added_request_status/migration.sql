-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "faceCount" INTEGER,
    "Status" TEXT NOT NULL DEFAULT 'NEW'
);
INSERT INTO "new_Request" ("createdAt", "faceCount", "id", "name", "updatedAt", "userId") SELECT "createdAt", "faceCount", "id", "name", "updatedAt", "userId" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE UNIQUE INDEX "Request_name_key" ON "Request"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
