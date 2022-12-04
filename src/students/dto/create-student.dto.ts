import { IsNotEmpty, IsISO8601 } from "class-validator";

export class CreateStudentDto {
  @IsNotEmpty()
  RUT: string

  @IsNotEmpty()
  PROFILE: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  dob: Date;

  @IsNotEmpty()
  address: string;
}
