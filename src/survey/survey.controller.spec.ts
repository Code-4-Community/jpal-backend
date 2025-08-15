import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { Survey } from './types/survey.entity';
import { mockResearcher, mockUser } from '../user/user.service.spec';
import { User } from 'src/user/types/user.entity';
import { SurveyTemplate } from 'src/surveyTemplate/types/surveyTemplate.entity';
import { CreateSurveyReponseDto } from './dto/create-survey.dto';

export const UUID = '123e4567-e89b-12d3-a456-426614174000';

export const mockSurveyTemplate: SurveyTemplate = {
  id: 1,
  creator: mockUser,
  name: 'name',
  questions: [],
};

export const mockSurvey: Survey = {
  id: 1,
  uuid: UUID,
  surveyTemplate: mockSurveyTemplate,
  organizationName: 'test',
  imageURL: 'https://jpal-letter-images.s3.us-east-2.amazonaws.com/test-image.png',
  treatmentPercentage: 50,
  name: 'Survey 1',
  creator: mockUser,
  assignments: [],
  date: new Date('02-06-2022'),
};

export const mockSurvey3: Survey = {
  id: 1,
  uuid: UUID,
  surveyTemplate: mockSurveyTemplate,
  organizationName: 'test',
  imageURL: 'https://jpal-letter-images.s3.us-east-2.amazonaws.com/test-image.png',
  treatmentPercentage: 50,
  name: 'new name',
  creator: mockUser,
  assignments: [],
  date: new Date('02-06-2022'),
};

const createMockSurveyResponse: CreateSurveyReponseDto = {
  id: 1,
  uuid: UUID,
  name: 'Survey 1',
  organizationName: '',
  imageURL: '',
  treatmentPercentage: 50,
};

export const mockSurvey2: Survey = {
  id: 2,
  uuid: UUID,
  surveyTemplate: mockSurveyTemplate,
  organizationName: '',
  imageURL: null,
  treatmentPercentage: 50,
  name: 'Survey 2',
  creator: mockResearcher,
  assignments: [],
  date: new Date('02-06-2022'),
};

export const listMockSurveys: Survey[] = [mockSurvey, mockSurvey2];

export const mockSurveyService: Partial<SurveyService> = {
  async create(
    surveyTemplateId: number,
    name: string,
    creator: User,
    organizationName: string,
    imageURL: string,
  ): Promise<Survey> {
    return {
      id: 1,
      uuid: UUID,
      surveyTemplate: mockSurveyTemplate,
      organizationName: '',
      imageURL: '',
      treatmentPercentage: 50,
      name,
      creator,
      assignments: [],
      date: new Date('02-06-2022'),
    };
  },
  async getByUUID(): Promise<Survey> {
    return mockSurvey;
  },

  findAllSurveysByUser: jest.fn(() => Promise.resolve([mockSurvey])),
  getAllSurveys: jest.fn(() => Promise.resolve(listMockSurveys)),
  getSurveyAssignments: jest.fn(() => Promise.resolve(mockSurvey)),
  edit: jest.fn(() => Promise.resolve(mockSurvey3)),
};

describe('SurveyController', () => {
  let controller: SurveyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        {
          provide: SurveyService,
          useValue: mockSurveyService,
        },
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a survey', async () => {
    const survey = await controller.create(
      {
        name: 'Survey 1',
        surveyTemplateId: 1,
        organizationName: '',
        imageBase64: '',
        treatmentPercentage: 50,
      },
      mockUser,
    );
    expect(survey).toEqual(createMockSurveyResponse);
  });

  it('should return a survey by its uuid', async () => {
    const survey = await controller.getByUUID(UUID);
    expect(survey).toEqual(mockSurvey);
  });
  it('should find all the surveys created by the user', async () => {
    expect(await controller.findAllSurveys(mockUser)).toEqual([mockSurvey]);
    expect(mockSurveyService.findAllSurveysByUser).toHaveBeenCalled();
  });
  it('should get all surveys for researcher', async () => {
    expect(await controller.findAllSurveys(mockResearcher)).toEqual(listMockSurveys);
    expect(mockSurveyService.getAllSurveys).toHaveBeenCalled();
  });

  describe('getSurveyAssignments', () => {
    it('should get the requested survey', async () => {
      expect(await controller.getSurveyAssignments(UUID, mockUser)).toEqual(mockSurvey);
      expect(mockSurveyService.getSurveyAssignments).toHaveBeenCalledWith(UUID, mockUser);
    });
  });

  describe('editSurvey', () => {
    it('should edit the requested survey', async () => {
      await expect(controller.edit({ surveyName: 'new name' }, mockUser, UUID)).resolves.toEqual(
        mockSurvey3,
      );

      expect(mockSurveyService.edit).toHaveBeenCalledWith(
        UUID,
        'new name',
        undefined,
        undefined,
        undefined,
      );
    });
  });
});
