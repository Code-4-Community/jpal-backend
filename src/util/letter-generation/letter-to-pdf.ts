import { Letter } from './generateLetter';
import { jsPDF } from 'jspdf';
import { imageSize } from 'image-size';

interface ImageData {
  imageBytes: Uint8Array;
  width: number;
  height: number;
}

async function getS3ImageData(imageURL: string): Promise<ImageData | null> {
  const response = await fetch(imageURL);

  if (!response.ok) {
    return null;
  }

  const imageBuffer = await response.arrayBuffer();
  const imageBytes = new Uint8Array(imageBuffer);
  const { width, height } = imageSize(imageBytes);
  
  return { imageBytes, width, height };
}

interface TextSettings {
  maxWidth: number;
  textStart: number;
  textEnd: number;
  lineHeight: number;
}

function placeLetterBody(doc: jsPDF, letter: Letter, settings: TextSettings) {
  const { maxWidth, textStart, textEnd, lineHeight } = settings;

  // Start 3 inches from the top
  let currentY = 3;
  
  doc.setFontSize(12);
  doc.setFont('times');

  // Date 
  const date = letter.date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }); // e.g. November 1, 2017
  doc.text(date, textEnd - doc.getTextWidth(date), currentY);
  currentY += 2 * lineHeight;
  
  // Salutation
  doc.text(letter.greeting, textStart, currentY);
  currentY += 2 * lineHeight; 

  // Write each paragraph with a line break in between
  letter.paragraphs.forEach(p => {
    const pLines = doc.splitTextToSize(p, maxWidth);
    doc.text(pLines, textStart, currentY);
    currentY += (pLines.length + 1) * lineHeight;
  });
  
  currentY += lineHeight;

  // Closing
  doc.text(letter.closing, textStart, currentY);
  currentY += lineHeight * 2;
  
  // Signature block
  doc.text(letter.signature.fullName, textStart, currentY);
  currentY += lineHeight;
  doc.text(letter.signature.organization, textStart, currentY);
}

function placeLetterFooter(doc: jsPDF, settings: TextSettings) {
    const { maxWidth, textStart, textEnd, lineHeight } = settings;
    
    // Start 2 inches from the bottom
    let currentY = doc.internal.pageSize.getHeight() - 2;
    
    doc.setFontSize(7.5)
    doc.setFont('helvetica');
    doc.setTextColor(255, 255, 255);

    // Draw footer banner: orange rectangle with white text
    const footerFillPadding = 0.15;
    const footerText = "The New York City Department of Youth and Community Development (DYCD) invests in a network of community-based organizations and programs to alleviate the effects of poverty and to provide opportunities for New Yorkers and communities to flourish.";
    const footerLines = doc.splitTextToSize(footerText, maxWidth - footerFillPadding * 2);

    // First, draw banner background
    doc.setFillColor(240, 100, 80);
    doc.rect(textStart, currentY - footerFillPadding, textEnd - textStart, footerLines.length * lineHeight + 1 * footerFillPadding, 'F');
    
    // ...then place text on background
    doc.text(footerLines, (textEnd + textStart - footerFillPadding) / 2, currentY, { align: 'center' });
    currentY += (footerLines.length + 2) * lineHeight;
    
    // ...followed by footer subtitle
    const footerSubText = "Empowering Individuals • Strengthening Families • Investing in Communities"
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold')
    
    const subWidth = doc.getTextWidth(footerSubText);
    doc.text(footerSubText, textStart + (textEnd - textStart - subWidth) / 2, currentY);
    currentY += lineHeight * 4;
    
    // Finally, write DYCD disclaimer note
    doc.setFontSize(10);
    doc.setFont('times', 'normal')
    const bottomNote = "Note: This recommendation letter is part of a pilot program being run by the New York City Department of Youth and Community Development. Some youth were randomly selected to be part of the pilot. These youth were eligible to receive a letter of recommendation, which reflects supervisor feedback about each individual's job performance.";
    const bottomNoteLines = doc.splitTextToSize(bottomNote, maxWidth);
    doc.text(bottomNoteLines, (textEnd + textStart) / 2, currentY, { align: 'center' });
}

export async function letterToPdf(letter: Letter): Promise<Buffer> {
    // Create new PDF document
    const doc = new jsPDF({ unit: "in" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const bodyMargin = 1.1;
    
    const letterBodySettings = {
      maxWidth: pageWidth - (2 * bodyMargin),
      textStart: bodyMargin,
      textEnd: pageWidth - bodyMargin,
      lineHeight: 0.2
    };

    if (letter.headerImageURL !== null) {
      const imageData = await getS3ImageData(letter.headerImageURL);
      if (imageData !== null) {
        const pdfPPI = doc.internal.scaleFactor; // conversion from pixels to inches (likely 72 pixels per inch)
        doc.addImage(imageData.imageBytes, letterBodySettings.textStart - 0.25, 1, imageData.width / pdfPPI, imageData.height / pdfPPI);
      } else {
        console.error(`Unable to get survey image from url: ${letter.headerImageURL}`);
      }
    }

    placeLetterBody(doc, letter, letterBodySettings);

    const footerMargin = 0.85
    const letterFooterSettings = {
      maxWidth: pageWidth - (2 * footerMargin),
      textStart: footerMargin,
      textEnd: pageWidth - footerMargin,
      lineHeight: 0.125
    }

    placeLetterFooter(doc, letterFooterSettings);
    
    return Buffer.from(doc.output('arraybuffer'));
}
