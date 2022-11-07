const { join } = require('path');
const { readdir, mkdir, copyFile, unlink } = require('fs/promises');
const { readdir: rd } = require('fs');


async function getCloneFolder() {

  try {
    const START_FILES = await readdir(join(__dirname));
    const FILES_FOLDER = await readdir(join(__dirname, 'files'));

    for await (const FILES of START_FILES) {
      FILES === 'files-copy' && getRemoveFolder();
    }

    await mkdir(join(__dirname, 'files-copy'), { recursive: true }, error => {
      if (error) throw new Error('Error folder copy');
    })

    for await (const FILES of FILES_FOLDER) {
      const PATH_FOLDER_FILES = join(__dirname, 'files', FILES);
      copyFile(PATH_FOLDER_FILES, join(__dirname, 'files-copy', FILES))
    }

  } catch (error) {
    console.error('error', error);
  }
}

getCloneFolder();

async function getRemoveFolder() {

  const PATH_FILES = await join(__dirname, 'files-copy');

  try {
    rd(PATH_FILES, (error, files) => {
      if (error) throw new Error('Erorr delete FIles');

      for (const FILES of files) {
        unlink(join(PATH_FILES, FILES));
      }
    })
  } catch (error) {
    console.error('error', error);
  }
}
