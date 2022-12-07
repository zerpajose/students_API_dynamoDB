import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { Student } from './entities/student.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UseGuards(AuthGuard('api-key'))
  @ApiSecurity('X-API-KEY')
  @ApiHeader({name: 'X-API-KEY', required: true})
  async create(@Body() student: CreateStudentDto): Promise<any> {
    await this.studentsService.create(student);
    return { msg: "Item created succesfully" };
  }

  @Get()
  findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get(':rut')
  @ApiParam({
    name: 'rut',
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
  @ApiBody({
    type: UpdateStudentDto
  })
  @UseGuards(AuthGuard('api-key'))
  @ApiSecurity('X-API-KEY')
  @ApiHeader({name: 'X-API-KEY', required: true})
  async update(@Param('rut') rut: string, @Body() student: UpdateStudentDto): Promise<any> {
    await this.studentsService.update(rut, student);
    return { msg: "Item updated succesfully" };
  }

  @Delete(':rut')
  @UseGuards(AuthGuard('api-key'))
  @ApiSecurity('X-API-KEY')
  @ApiHeader({name: 'X-API-KEY', required: true})
  async remove(@Param('rut') rut: string): Promise<any> {
    await this.studentsService.remove(rut);
    return { msg: "Item deleted succesfully" };
  }
}
