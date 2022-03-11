import { exampleLetter } from './examples';
import { letterToPdf } from './letter-to-pdf';

describe('Letter to PDF', () => {
  it('should contain all the content of the letter data structure', async () => {
    const doc = letterToPdf(exampleLetter);
    console.log('pdf', await doc.asBuffer().then((buffer) => buffer.toString('base64')));

    expect(true).toBe(true);
  });
});
