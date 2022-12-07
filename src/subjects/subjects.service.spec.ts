import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsService } from './subjects.service';
import { DocumentClient } from "aws-sdk/clients/dynamodb";

describe('SubjectsService', () => {
  let service: SubjectsService;

  const isTest = process.env.JEST_WORKER_ID;
  const config = {
    convertEmptyValues: true,
    ...(isTest && {
      endpoint: "http://localhost:8000",
      sslEnabled: false,
      region: "localhost"
    })
  };

  const ddb = new DocumentClient(config);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectsService],
    }).compile();

    service = module.get<SubjectsService>(SubjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should insert subject into table", async () => {
    await ddb.put(
      {
        TableName: "alumnos",
        Item: {
          id: '111',
          RUT: '11111111-1',
          PROFILE: 'SUBJECT#11111111-1',
          subjectName: 'Test',
          subjectMark: 0.0
        },
      }).promise();

    const { Items } = await ddb.query(
      {
        TableName: "alumnos",
        KeyConditionExpression: "#541b0 = :541b0 And begins_with(#541b1, :541b1)",
        FilterExpression: "#541b2 = :541b2",
        ExpressionAttributeValues: {
          ":541b0": "11111111-1",
          ":541b1": "SUBJECT#",
          ":541b2": "Test"
        },
        "ExpressionAttributeNames": {
          "#541b0": "RUT",
          "#541b1": "PROFILE",
          "#541b2": "subjectName"
        }
      }).promise();

    expect(Items[0]).toEqual({
      id: "111",
      RUT: "11111111-1",
      PROFILE: 'SUBJECT#11111111-1',
      subjectName: 'Test',
      subjectMark: 0.0,
    });
  });

  it("should get subject from table", async () => {

    const { Item } = await ddb.get({
      TableName: "alumnos",
      Key: {
        RUT: "12345678-9",
        PROFILE: "PROFILE#12345678-9"
      }
    }).promise();

    expect(Item).toEqual({
      id: '88f2105c-c826-40d6-898f-60b04152bf57',
      RUT: '12345678-9',
      PROFILE: 'PROFILE#12345678-9',
      firstName: 'Juan',
      lastName: 'Perez',
      dob: '1988-03-17',
      address: 'Cynth Av. Santa Isabel, CA.'
    });
  });
});
