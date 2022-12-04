import { IsNotEmpty } from "class-validator";

export class CreateSubjectDto {
  PROFILE: string

  @IsNotEmpty()
  subjectName: string

  @IsNotEmpty()
  subjectMark: string;
}
