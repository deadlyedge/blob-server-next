-- CreateTable
CREATE TABLE "UserInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "totalSize" INTEGER NOT NULL DEFAULT 0,
    "totalUploadTimes" INTEGER NOT NULL DEFAULT 0,
    "totalUploadByte" INTEGER NOT NULL DEFAULT 0,
    "totalDownloadTimes" INTEGER NOT NULL DEFAULT 0,
    "totalDownloadByte" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUploadAt" DATETIME,
    "lastDownloadAt" DATETIME
);

-- CreateTable
CREATE TABLE "FileInfo" (
    "fileId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL DEFAULT '',
    "uploadAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "downloadTimes" INTEGER NOT NULL DEFAULT 0,
    "lastDownloadAt" DATETIME,
    CONSTRAINT "FileInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserInfo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_user_key" ON "UserInfo"("user");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_token_key" ON "UserInfo"("token");

-- CreateIndex
CREATE INDEX "UserInfo_token_idx" ON "UserInfo"("token");

-- CreateIndex
CREATE INDEX "UserInfo_lastUploadAt_lastDownloadAt_idx" ON "UserInfo"("lastUploadAt", "lastDownloadAt");

-- CreateIndex
CREATE UNIQUE INDEX "FileInfo_fileId_key" ON "FileInfo"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "FileInfo_userId_key" ON "FileInfo"("userId");

-- CreateIndex
CREATE INDEX "FileInfo_userId_uploadAt_idx" ON "FileInfo"("userId", "uploadAt");

-- CreateIndex
CREATE INDEX "FileInfo_userId_lastDownloadAt_idx" ON "FileInfo"("userId", "lastDownloadAt");
