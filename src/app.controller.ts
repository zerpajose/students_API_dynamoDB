import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Student, Subject } from './interface';

@Controller('students')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getStudents(): Promise<Student[]> {
    return await this.appService.getStudents();
  }

  @Post()
  async createStudent(@Body() student: Student): Promise<Student> {
    return await this.appService.createStudent(student);
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
  async getStudentByRut(@Param('rut') rut: string): Promise<Student[]> {
    return await this.appService.getStudentByRut(rut);
  }

  @Delete(':id')
  async deleteStudent(@Param() id: string): Promise<any> {
    return await this.appService.deleteStudent(id);
  }

  @Get('subjects')
  async getAllStudentsSubjects(): Promise<Subject[]> {
    return await this.appService.getAllStudentsSubjects();
  }

  @Get('subjects/:rut')
  async getSubjectsByStudentRut(@Param('rut') rut: string): Promise<Subject[]> {
    return await this.appService.getSubjectsByStudentRut(rut);
  }

  @Post('subject')
  async createSubject(@Body() subject: Subject): Promise<Subject> {
    return await this.appService.createSubjectByStudent(subject);
  }
}
