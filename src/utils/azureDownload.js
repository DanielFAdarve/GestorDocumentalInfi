const { ShareServiceClient, StorageSharedKeyCredential } = require('@azure/storage-file-share');
require('dotenv').config();

const AZURE_STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
const AZURE_STORAGE_KEY = process.env.AZURE_STORAGE_KEY;
const SHARE_NAME = process.env.AZURE_SHARE_NAME;

function getServiceClient() {
  if (!AZURE_STORAGE_ACCOUNT || !AZURE_STORAGE_KEY) {
    throw new Error('Azure credentials no configuradas');
  }

  return new ShareServiceClient(
    `https://${AZURE_STORAGE_ACCOUNT}.file.core.windows.net`,
    new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY)
  );
}

/**
 * Descarga archivo desde Azure File Share como Buffer
 * @param {string} remotePath Ej: supports/123/file.pdf
 */
async function downloadFromAzure(remotePath) {
  const serviceClient = getServiceClient();

  const shareClient = serviceClient.getShareClient(SHARE_NAME);

  const parts = remotePath.split('/');
  const fileName = parts.pop();

  let currentDir = shareClient.rootDirectoryClient;

  // Navegar carpetas igual que en upload
  for (const folder of parts) {
    currentDir = currentDir.getDirectoryClient(folder);
  }

  const fileClient = currentDir.getFileClient(fileName);

  if (!(await fileClient.exists())) {
    throw new Error('Archivo no existe en Azure');
  }

  const downloadResponse = await fileClient.download();

  const chunks = [];

  for await (const chunk of downloadResponse.readableStreamBody) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = { downloadFromAzure };