const { join, basename, extname } = require('path');
const { createReadStream, createWriteStream, mkdir: mk } = require('fs');
const { mkdir, readFile, readdir, copyFile } = require('fs/promises');


const PATH_FOLDER_END = join(__dirname, './project-dist');
const PATH_FILE_HTML = join(__dirname, './template.html');
const PATH_FOLDER_ASSETS = join(__dirname, './assets');
const PATH_ASSETS_END = join(__dirname, './project-dist/assets');

const PATH_FOLDER_COMPANENETS = join(__dirname, './components');
const PATH_FOLDER_CSS = join(__dirname, './styles');


const PATH_HTML_END = createWriteStream(join(PATH_FOLDER_END, 'index.html'));
const PATH_CSS_END = createWriteStream(join(PATH_FOLDER_END, 'style.css'));


function getCreateFolter() {
  mkdir(join(__dirname, 'project-dist'), { recursive: true }, err => {
    if (err) throw new Error('Error create folder');
  })
}

getCreateFolter();


async function getElementsHtml() {
  try {
    let dataHtmFile = await readFile(PATH_FILE_HTML);
    const FILES_COMPONENET = await readdir(PATH_FOLDER_COMPANENETS);

    for (let i = 0; i < FILES_COMPONENET.length; i++) {
      if (extname(FILES_COMPONENET[i]).slice(1) === 'html') {
        const PATH_FILES_FOLDER_COMPONENTS = join(PATH_FOLDER_COMPANENETS, FILES_COMPONENET[i]);
        const NAMES_FILES = basename(PATH_FILES_FOLDER_COMPONENTS, extname(PATH_FILES_FOLDER_COMPONENTS));
        const TEXT_FILES_COMPONENTS = await readFile(PATH_FILES_FOLDER_COMPONENTS);
        dataHtmFile = dataHtmFile.toString().replace(`{{${NAMES_FILES}}}`, TEXT_FILES_COMPONENTS);
      }
    }

    PATH_HTML_END.write(dataHtmFile);
  } catch (error) {
    console.error('error', error);
  }
}

getElementsHtml();


async function getElementsCss() {
  try {
    const PATH_FILES_FOLDER = await readdir(PATH_FOLDER_CSS);
    for await (const FILES of PATH_FILES_FOLDER) {
      if (extname(FILES).slice(1) === 'css') {
        createReadStream(join(PATH_FOLDER_CSS, FILES)).on('data', chunk => {
          PATH_CSS_END.write('\n' + chunk.toString() + '\n');
        })
      }
    }
  } catch (error) {
    console.error('error', error);
  }
}

getElementsCss();


async function getCopyFolder(folder_assets, assets_end) {
  try {
    mk(join(assets_end), { recursive: true }, async function () {
      const DATA_FOLDER = await readdir(folder_assets, { withFileTypes: true });
      for (const FILES of DATA_FOLDER) {
        FILES.isFile() && copyFile(join(folder_assets, `./${FILES.name}`), join(assets_end, `./${FILES.name}`));
        FILES.isDirectory() && getCopyFolder(join(folder_assets, `./${FILES.name}`), join(assets_end, `./${FILES.name}`));
      }
    })
  } catch (error) {
    console.error('error', error);
  }
}

getCopyFolder(PATH_FOLDER_ASSETS, PATH_ASSETS_END);