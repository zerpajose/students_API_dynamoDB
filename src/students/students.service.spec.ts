import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { DocumentClient } from "aws-sdk/clients/dynamodb";

describe('StudentsService', () => {
  let service: StudentsService;

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

  afterAll(() => {
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsService],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should insert student into table", async () => {
    await ddb.put({
      TableName: "alumnos",
      Item: {
        id: "1",
        RUT: "11111111-1",
        PROFILE: 'PROFILE#11111111-1',
        firstName: 'John',
        lastName: 'Doe',
        dob: '1999/06/25',
        address: '123 Clayton St., NYCity, NY'
      },
    }).promise();

    const { Item } = await ddb.get({
      TableName: "alumnos",
      Key: {
        RUT: "11111111-1",
        PROFILE: "PROFILE#11111111-1"
      }
    }).promise();

    expect(Item).toEqual({
      id: "1",
      RUT: "11111111-1",
      PROFILE: 'PROFILE#11111111-1',
      firstName: 'John',
      lastName: 'Doe',
      dob: '1999/06/25',
      address: '123 Clayton St., NYCity, NY'
    });
  });

  it("should get student from table", async () => {

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
