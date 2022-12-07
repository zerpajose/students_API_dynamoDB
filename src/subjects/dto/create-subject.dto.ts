import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSubjectDto {
  PROFILE: string

  @ApiProperty({
    description: `Subject's Name`,
    example: 'Chemistry',
  })
  @IsNotEmpty()
  subjectName: string

  @ApiProperty({
    description: `Subject's Mark`,
    example: 3.7,
  })
  @IsNotEmpty()
  subjectMark: string;
}
