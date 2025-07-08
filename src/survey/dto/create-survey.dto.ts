export class CreateSurveyDto {
  name: string;
  surveyTemplateId: number;
  organizationName: string;
  imageBase64: string;
  treatmentPercentage: number;
}

export class CreateSurveyReponseDto {
  name: string;
  uuid: string;
  id: number;
  organizationName: string;
  imageURL: string;
  treatmentPercentage: number;
}
