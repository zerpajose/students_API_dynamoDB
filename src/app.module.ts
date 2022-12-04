import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SubjectsModule,
    StudentsModule,
    AuthModule,
  ],
})
export class AppModule {}
