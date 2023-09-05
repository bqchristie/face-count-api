-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "faceCount" INTEGER,
    "Status" TEXT NOT NULL DEFAULT 'NEW',
    CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("Status", "createdAt", "faceCount", "filename", "id", "name", "updatedAt", "userId") SELECT "Status", "createdAt", "faceCount", "filename", "id", "name", "updatedAt", "userId" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE UNIQUE INDEX "Request_name_key" ON "Request"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
