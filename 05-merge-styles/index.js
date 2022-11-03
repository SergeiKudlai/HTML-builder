const { join, extname } = require('path');
const { readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const FILES_FINISH = createWriteStream(join(__dirname, './project-dist/bundle.css'));


async function getBundleCss() {
  const PATH_FOLDER = await join(__dirname, 'styles');
  const FILES_STYLES_FOLDER = await readdir(PATH_FOLDER);

  try {

    for await (const FILES of FILES_STYLES_FOLDER) {
      if (extname(FILES).slice(1) === 'css') {
        createReadStream(join(PATH_FOLDER, FILES)).on('data', chunk => FILES_FINISH.write('\n' + chunk.toString() + '\n'));
      }
    }

  } catch (error) {
    console.error('error', error);
  }
}

getBundleCss();