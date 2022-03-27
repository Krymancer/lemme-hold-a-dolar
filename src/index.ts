import fetch from 'node-fetch';
import dotenv from 'dotenv';
import jimp from 'jimp';

dotenv.config();

const SOURCE_IMAGE = 'dist/assets/source.jpeg';
const NEW_FILE_BASE = 'dist/assets/image-';

async function getUSDValueInBRL() {
  const apiKey = process.env.API_KEY;
  const params = {
    apiKey,
    compact: 'ultra',
    target: 'BRL',
    from: 'USD',
  };

  const baseUrl = 'https://free.currconv.com/api/v7/convert';
  const url = `${baseUrl}?q=${params.from}_${params.target}&compact=${params.compact}&apiKey=${params.apiKey}`;
  const response : any = await fetch(url).then((res) => res.json());

  return response.USD_BRL;
}

function generateFilename() {
  return NEW_FILE_BASE + (new Date().toJSON().slice(0, 10)) + '.jpeg';
}

async function getConstants(image : any, caption : any) {
  const blackFont = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
  const whiteFont = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
  const height = image.bitmap.height;
  const width = image.bitmap.width;
  const lenTop = caption.top.length;
  const lenBottom = caption.bottom.length;

  const topOffset = 15;
  const bottomOffset = height - 100;
  const fontOffset = 5;

  const letterOffset = 15;
  const lineOffset = {
    top: width/2 - (lenTop*letterOffset),
    bottom: width/2 - (lenBottom*letterOffset),
  };

  return {
    blackFont,
    whiteFont,
    topOffset,
    bottomOffset,
    lineOffset,
    fontOffset,
  };
}

async function writeCaption(image: any, caption: any) {
  const {
    blackFont,
    whiteFont,
    topOffset,
    bottomOffset,
    lineOffset,
    fontOffset,
  } = await getConstants(image, caption);

  image.print(blackFont, lineOffset.top, topOffset + fontOffset, caption.top); // TOP OUTLINE
  image.print(blackFont, lineOffset.top, topOffset - fontOffset, caption.top); // BOTTOM OUTLINE
  image.print(blackFont, lineOffset.top + fontOffset, topOffset, caption.top); // RIGHT OUTLINE
  image.print(blackFont, lineOffset.top - fontOffset, topOffset, caption.top); // LEFT OUTLINE

  image.print(blackFont, lineOffset.bottom, bottomOffset + fontOffset, caption.bottom); // TOP OUTLINE
  image.print(blackFont, lineOffset.bottom, bottomOffset - fontOffset, caption.bottom); // BOTTOM OUTLINE
  image.print(blackFont, lineOffset.bottom + fontOffset, bottomOffset, caption.bottom); // RIGHT OUTLINE
  image.print(blackFont, lineOffset.bottom - fontOffset, bottomOffset, caption.bottom); // LEFT OUTLINE

  image.print(whiteFont, lineOffset.top, topOffset, caption.top);
  image.print(whiteFont, lineOffset.bottom, bottomOffset, caption.bottom);
}

async function generateImage() {
  const value = await getUSDValueInBRL();
  const newFileName = generateFilename();

  const caption = {
    top: 'Carinha que mora logo ali',
    bottom: `Me passsa R$ ${value.toFixed(2)}`,
  };

  const image = await jimp.read(SOURCE_IMAGE);
  await writeCaption(image, caption);
  image.write(newFileName);
}

generateImage();
