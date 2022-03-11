import * as pdf from 'pdfjs';
import * as TimesNewRoman from 'pdfjs/font/Times-Roman';
import { Letter } from './generateLetter';

/**
 * Generates a very basic PDF document from a Letter (see generatedLetterv1.pdf)
 */
export function letterToPdf(letter: Letter): pdf.Document {
  const doc = new pdf.Document({
    font: TimesNewRoman,
    padding: 10,
  });
  //doc.pipe(fs.createWriteStream('./output.pdf'))
  doc.text(`${letter.greeting},`);

  letter.paragraphs.forEach((paragraph) => {
    doc.text(paragraph);
  });

  doc.text(`${letter.closing},`);
  doc.text(`${letter.signature.fullName}`);
  doc.text(`${letter.signature.organization}`);

  return doc;
}
