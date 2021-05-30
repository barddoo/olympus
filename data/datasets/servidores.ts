import download from 'download';
import decompress from 'decompress';
import path from 'path';

async function downloadData(downloadFile: string, dest: string): Promise<void> {
  await download(downloadFile, dest);
}

async function unzip(fileName: string, dest: string): Promise<string[]> {
  return decompress(path.join(dest, fileName), dest, {
    filter(file: decompress.File): boolean {
      return /_(Cadastro|Remuneracao)+/.test(file.path);
    },
  }).then((files) => files.map((file) => file.path));
}

export async function servidores(
  downloadUrl: string,
  fileName: string,
  destination: string
): Promise<void> {
  await downloadData(downloadUrl, destination);
  await unzip(`${fileName}.zip`, destination);
}
