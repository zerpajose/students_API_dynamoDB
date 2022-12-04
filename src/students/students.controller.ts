import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { Student } from './entities/student.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UseGuards(AuthGuard('api-key'))
  create(@Body() student: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(student);
  }

  @Get()
  findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get(':rut')
  @ApiParam({
    name: 'RUT',
    required: true,
    description: 'Get a Student by RUT',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a Student based on a specific RUT',
  })
  findOne(@Param('rut') rut: string): Promise<Student> {
    return this.studentsService.findOne(rut);
  }

  @Patch(':rut')
  @UseGuards(AuthGuard('api-key'))
  update(@Param('rut') rut: string, @Body() student: UpdateStudentDto): Promise<Student> {
    return this.studentsService.update(rut, student);
  }

  @Delete(':rut')
  @UseGuards(AuthGuard('api-key'))
  async remove(@Param('rut') rut: string): Promise<any> {
    return await this.studentsService.remove(rut);
  }
}
