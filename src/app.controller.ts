import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Student, Subject } from './interface';

@Controller()
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
  async getStudentByRut(@Param('rut') rut: string): Promise<Student[]> {
    return await this.appService.getStudentByRut(rut);
  }

  @Delete(':id')
  async deleteStudent(@Param() id: string): Promise<any> {
    return await this.appService.deleteStudent(id);
  }

  @Get('subject')
  async getStudentsSubjects(@Query('subjects') query: string): Promise<Subject[]> {
    return await this.appService.getAllStudentsSubjects(query);
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
