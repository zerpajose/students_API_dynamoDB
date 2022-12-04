import { Test, TestingModule } from '@nestjs/testing';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

describe('SubjectsController', () => {
  let controller: SubjectsController;
  let mockSubjectService = {
    create: jest.fn((rut, dto) => {
      return {
        RUT: rut,
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
              "subjectMark": 5.5,
              "id": "629ee526-a21f-4308-85ac-86e357f4c7cf",
              "PROFILE": "SUBJECT#629ee526-a21f-4308-85ac-86e357f4c7cf",
              "subjectName": "Geography"
          },
        ]
      }
    }),
    findOne: jest.fn((rut)=>{
      return {
        "Items": [
          {
              "RUT": rut,
              "subjectMark": 5.5,
              "id": "629ee526-a21f-4308-85ac-86e357f4c7cf",
              "PROFILE": "SUBJECT#629ee526-a21f-4308-85ac-86e357f4c7cf",
              "subjectName": "Geography"
          },
        ]
      }
    }),
    remove: jest.fn((rut, subjectName) => {
      return {
        rut: rut,
        subjectName: subjectName,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectsController],
      providers: [SubjectsService],
    })
      .overrideProvider(SubjectsService)
      .useValue(mockSubjectService)
      .compile();

    controller = module.get<SubjectsController>(SubjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a subject', () => {
    const createSubjectDto: CreateSubjectDto = {
      PROFILE: 'PROFILE#12345678-9',
      subjectName: 'Math',
      subjectMark: '5.5',
    };

    const rut = '12345678-9';

    expect(controller.create(rut, createSubjectDto)).resolves.toEqual({ msg: "Item created succesfully" });
  });

  it('should update a student', () => {
    const updateSubjectDto: UpdateSubjectDto = {
      subjectName: 'Math',
      subjectMark: '5.5',
    };
    const studentRut = "12345678-9";
    const subjectName = "Math";

    expect(controller.update(studentRut, subjectName, updateSubjectDto)).resolves.toEqual({ msg: "Item updated succesfully" });
    expect(mockSubjectService.update).toHaveBeenCalledWith(
      studentRut,
      updateSubjectDto,
      subjectName,
    );
  });

  it('should return an array of subjects', async () => {
    const result = {
      "Items": [
        {
            "RUT": "12345678-9",
            "subjectMark": 5.5,
            "id": "629ee526-a21f-4308-85ac-86e357f4c7cf",
            "PROFILE": "SUBJECT#629ee526-a21f-4308-85ac-86e357f4c7cf",
            "subjectName": "Geography"
        },
      ]
    };

    expect(controller.findAll()).toEqual(result);
  });

  it('should return all subjects by a specific rut', async () => {
    const result = {
      "Items": [
        {
            "RUT": "12345678-9",
            "subjectMark": 5.5,
            "id": "629ee526-a21f-4308-85ac-86e357f4c7cf",
            "PROFILE": "SUBJECT#629ee526-a21f-4308-85ac-86e357f4c7cf",
            "subjectName": "Geography"
        },
      ]
    };
    const studentRut = "12345678-9";

    expect(controller.findOne(studentRut)).toEqual(result);
  });

  it('should delete a subject by rut & subjectName', async () => {
    const studentRut = "12345678-9";
    const subjectName = "Math";
    expect(controller.remove(studentRut, subjectName)).resolves.toEqual({ msg: "Item deleted succesfully" });
  });

});
