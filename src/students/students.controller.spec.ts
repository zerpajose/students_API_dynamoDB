import { Test, TestingModule } from '@nestjs/testing';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

describe('StudentsController', () => {
  let controller: StudentsController;
  let mockStudentService = {
    create: jest.fn((dto) => {
      return {
        id: Math.random() * (1000 - 1) + 1,
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => {
      return {
        id: id,
        ...dto,
      };
    }),
    findAll: jest.fn(()=>{
      return {
        "Items": [
          {
              "RUT": "12345678-9",
              "firstName": "Juan",
              "lastName": "Perez",
              "PROFILE": "PROFILE#12345678-9",
              "address": "Cynth Av. Santa Isabel, CA.",
              "dob": "1988-03-17",
              "id": "88f2105c-c826-40d6-898f-60b04152bf57"
          }
        ]
      }
    }),
    findOne: jest.fn((rut)=>{
      return {
        "Items": [
          {
              "RUT": rut,
              "firstName": "Juan",
              "lastName": "Perez",
              "PROFILE": "PROFILE#12345678-9",
              "address": "Cynth Av. Santa Isabel, CA.",
              "dob": "1988-03-17",
              "id": "88f2105c-c826-40d6-898f-60b04152bf57"
          }
        ]
      }
    }),
    remove: jest.fn((id) => {
      return {
        id: id
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [StudentsService],
    }).overrideProvider(StudentsService)
      .useValue(mockStudentService)
      .compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a student', () => {
    const createStudentDto: CreateStudentDto = {
      RUT: '12312312-3',
      PROFILE: 'PROFILE#12312312-3',
      firstName: 'Joseph',
      lastName: 'Gabanna',
      dob: new Date(),
      address: 'Red St. Savanna, CA.',
    };

    expect(controller.create(createStudentDto)).resolves.toEqual({ msg: "Item created succesfully" });
  });

  it('should update a student', () => {
    const updateStudentDto: UpdateStudentDto = {
      firstName: 'John',
      lastName: 'Smith',
      dob: new Date(),
      address: '1234 Saron St. Placeville CA:',
    };
    const studentRut = "12312312-3";

    expect(controller.update(studentRut, updateStudentDto)).resolves.toEqual({ msg: "Item updated succesfully" });
    expect(mockStudentService.update).toHaveBeenCalledWith(
      studentRut,
      updateStudentDto,
    );
  });

  it('should return an array of students', async () => {
    const result = {
      "Items": [
        {
            "RUT": "12345678-9",
            "firstName": "Juan",
            "lastName": "Perez",
            "PROFILE": "PROFILE#12345678-9",
            "address": "Cynth Av. Santa Isabel, CA.",
            "dob": "1988-03-17",
            "id": "88f2105c-c826-40d6-898f-60b04152bf57"
        }
      ]
    };

    expect(controller.findAll()).toEqual(result);
  });

  it('should return a student by rut', async () => {
    const result = {
      "Items": [
        {
            "RUT": "12345678-9",
            "firstName": "Juan",
            "lastName": "Perez",
            "PROFILE": "PROFILE#12345678-9",
            "address": "Cynth Av. Santa Isabel, CA.",
            "dob": "1988-03-17",
            "id": "88f2105c-c826-40d6-898f-60b04152bf57"
        }
      ]
    };
    const studentRut = "12345678-9";

    expect(controller.findOne(studentRut)).toEqual(result);
  });

  it('should delete a student by rut', async () => {
    const studentRut = "12345678-9";
    expect(controller.remove(studentRut)).resolves.toEqual({ msg: "Item deleted succesfully" });
  });
});
