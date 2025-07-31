export class SentenceDto {
  id: number;
  template: string;
  multiTemplate?: string;
  isPlainText: boolean;
  isMultiQuestion: boolean;
  includeIfSelectedOptions: string[];
}

export class SentenceCreateDto {
  template: string;
  multiTemplate?: string;
  isPlainText: boolean;
  isMultiQuestion: boolean;
  includeIfSelectedOptions: string[];
}