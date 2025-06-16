export class CreateSurveyDto {
  name: string;
  surveyTemplateId: number;
  organizationName: string;
  imageURL: string;
}

export class CreateSurveyReponseDto {
  name: string;
  uuid: string;
  id: number;
  organizationName: string;
  imageURL: string;
}
