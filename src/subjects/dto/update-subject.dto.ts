import { PickType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PickType(
    CreateSubjectDto, ['subjectName', 'subjectMark'] as const
) { }

