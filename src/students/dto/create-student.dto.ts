import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsISO8601 } from "class-validator";

export class CreateStudentDto {
  @ApiProperty({
    description: `Student's National ID`,
    example: '12345678-9',
  })
  @IsNotEmpty()
  RUT: string

  PROFILE: string;

  @ApiProperty({
    description: `Student's First Name`,
    example: 'John',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: `Student's Last Name`,
    example: 'Doe',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: `Student's Date of Birth`,
    example: '1999-02-02',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  dob: Date;

  @ApiProperty({
    description: `Student's Address`,
    example: '301 Wall St. New York City, NY.',
  })
  @IsNotEmpty()
  address: string;
}
