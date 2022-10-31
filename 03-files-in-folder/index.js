const { join, extname, basename } = require('path');
const { readdir, stat } = require('fs/promises');
const FILES = join(__dirname, 'secret-folder');

async function getCloneFiles() {

  try {
    const DATA = await readdir(FILES);

    for (const VALUE of DATA) {
      const PATH_FILES = await stat(join(FILES, VALUE));

      if (PATH_FILES.isFile()) {
        console.log(`${basename(VALUE, extname(VALUE))} - ${extname(VALUE).slice(1)} - ${PATH_FILES.size}b`);
      }
    }
  } catch (error) {
    console.error(error);
  }

}

getCloneFiles();