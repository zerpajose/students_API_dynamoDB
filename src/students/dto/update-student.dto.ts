import { PickType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PickType(
    CreateStudentDto, ['firstName', 'lastName', 'dob', 'address'] as const
) { }
