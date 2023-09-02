/*
  Warnings:

  - You are about to alter the column `rating` on the `UserRating` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL NOT NULL,
    "todoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "UserRating_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserRating" ("id", "rating", "todoId", "userId") SELECT "id", "rating", "todoId", "userId" FROM "UserRating";
DROP TABLE "UserRating";
ALTER TABLE "new_UserRating" RENAME TO "UserRating";
CREATE UNIQUE INDEX "UserRating_userId_todoId_key" ON "UserRating"("userId", "todoId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
