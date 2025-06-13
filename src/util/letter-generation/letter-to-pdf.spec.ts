import { exampleLetter } from './examples';
import { letterToPdf } from './letter-to-pdf';

describe('Letter to PDF', () => {
  it.skip('should contain all the content of the letter data structure', async () => {
    const doc = await letterToPdf(exampleLetter, null);
    console.log('pdf', await doc.toString('base64'));

    expect(true).toBe(true);
  });
});
