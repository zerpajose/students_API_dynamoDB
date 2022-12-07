import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiParam, ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { Subject } from './entities/subject.interface';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post(':rut')
  @UseGuards(AuthGuard('api-key'))
  @ApiSecurity('X-API-KEY')
  @ApiHeader({name: 'X-API-KEY', required: true})
  async create(@Param('rut') rut: string, @Body() subject: CreateSubjectDto): Promise<any> {
    await this.subjectsService.create(rut, subject);    
    return { msg: "Item created succesfully" };
  }

  @Get()
  findAll(): Promise<Subject[]> {
    return this.subjectsService.findAll();
  }

  @Get(':rut')
  findOne(@Param('rut') rut: string) {
    return this.subjectsService.findOne(rut);
  }

  @Patch(':rut/:subjectName')
  @UseGuards(AuthGuard('api-key'))
  @ApiSecurity('X-API-KEY')
  @ApiHeader({name: 'X-API-KEY', required: true})
  async update(@Param('rut') rut: string, @Param('subjectName') subjectName: string, @Body() subject: UpdateSubjectDto): Promise<any>{
    await this.subjectsService.update(rut, subject, subjectName);
    return { msg: "Item updated succesfully" };
  }

  @Delete(':rut/:subjectName')
  @UseGuards(AuthGuard('api-key'))
  @ApiSecurity('X-API-KEY')
  @ApiHeader({name: 'X-API-KEY', required: true})
  async remove(@Param('rut') rut: string, @Param('subjectName') subjectName: string): Promise<any> {
    await this.subjectsService.remove(rut, subjectName);
    return { msg: "Item deleted succesfully" };
  }
}
