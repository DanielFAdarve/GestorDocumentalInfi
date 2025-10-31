const { ShareServiceClient, StorageSharedKeyCredential } = require('@azure/storage-file-share');
require('dotenv').config();

const AZURE_STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
const AZURE_STORAGE_KEY = process.env.AZURE_STORAGE_KEY;
const SHARE_NAME = process.env.AZURE_SHARE_NAME;
const serviceClient = new ShareServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT}.file.core.windows.net`,
  new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY)
);

const MAX_CHUNK_SIZE = 4 * 1024 * 1024;

async function uploadBase64ToAzure(base64Data, remotePath) {
  const buffer = Buffer.from(base64Data, 'base64');
  const shareClient = serviceClient.getShareClient(SHARE_NAME);
  const folders = remotePath.split('/');
  const fileName = folders.pop();
  let currentDir = shareClient.rootDirectoryClient;

  for (const folder of folders) {
    const nextDir = currentDir.getDirectoryClient(folder);
    if (!(await nextDir.exists())) await nextDir.create();
    currentDir = nextDir;
  }

  const fileClient = currentDir.getFileClient(fileName);
  if (await fileClient.exists()) await fileClient.delete();
  await fileClient.create(buffer.length, { overwrite: true });

  let offset = 0;
  while (offset < buffer.length) {
    const chunkSize = Math.min(MAX_CHUNK_SIZE, buffer.length - offset);
    await fileClient.uploadRange(buffer.slice(offset, offset + chunkSize), offset, chunkSize);
    offset += chunkSize;
  }

  return `https://${AZURE_STORAGE_ACCOUNT}.file.core.windows.net/${SHARE_NAME}/${remotePath}`;
}

module.exports = { uploadBase64ToAzure };
