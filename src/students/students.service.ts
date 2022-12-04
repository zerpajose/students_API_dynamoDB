import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';
import { Student } from './entities/student.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

const dynamoDB = process.env.IS_OFFLINE
  ? new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: process.env.DYNAMODB_ENDPOINT,
  })
  : new AWS.DynamoDB.DocumentClient();

@Injectable()
export class StudentsService {
  async create(student: CreateStudentDto): Promise<any> {
    const studentObj = {
      id: uuid(),
      ...student,
    };
    try {
      return await dynamoDB
        .put({
          TableName: "alumnos",
          Item: studentObj,
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll(): Promise<any> {
    try {
      return await dynamoDB
        .scan({
          TableName: "alumnos",
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(rut: string): Promise<any> {
    const params = {
      ExpressionAttributeValues: {
        ':s': rut,
        ':e': `PROFILE#${rut}`,
      },
      KeyConditionExpression: 'RUT = :s and PROFILE = :e',
      TableName: 'alumnos'
    };

    try {
      return await dynamoDB.query(params).promise();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async update(rut: string, student: UpdateStudentDto): Promise<any> {

    const params = {
      TableName: "alumnos",
      Key: {
        RUT: rut,
        PROFILE: `PROFILE#${rut}`
      },
      UpdateExpression: "SET #firstName = :firstName, #lastName = :lastName, #dob = :dob, #address = :address",
      ExpressionAttributeValues: {
        ":firstName": student.firstName,
        ":lastName": student.lastName,
        ":dob": student.dob,
        ":address": student.address
      },
      ExpressionAttributeNames: {
        "#firstName": "firstName",
        "#lastName": "lastName",
        "#dob": "dob",
        "#address": "address"
      }
    }

    try {
      return await dynamoDB.update(params).promise();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async remove(rut: string): Promise<any> {
    try {
      return await dynamoDB
        .delete({
          TableName: "alumnos",
          Key: {
            rut: rut,
          },
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
