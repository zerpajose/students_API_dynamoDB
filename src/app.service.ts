import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';
import { Student, Subject } from './interface';

const dynamoDB = process.env.IS_OFFLINE
  ? new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: process.env.DYNAMODB_ENDPOINT,
  })
  : new AWS.DynamoDB.DocumentClient();

@Injectable()
export class AppService {
  async getStudents(): Promise<any> {
    try {
      return dynamoDB
        .scan({
          TableName: "alumnos",
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createStudent(student: Student): Promise<any> {
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

  async getStudentByRut(rut: string): Promise<any> {
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

  async deleteStudent(rut: string): Promise<any> {
    try {
      return await dynamoDB
        .delete({
          TableName: "alumnos",
          Key: {
            RUT: rut,
          },
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getSubjectsByStudentRut(rut: string): Promise<any> {
    const params = {
      KeyConditionExpression: '#rut = :rut and begins_with(#subject, :subject)',
      ExpressionAttributeNames: {
        "#rut": "RUT",
        "#subject": 'PROFILE'
      },
      ExpressionAttributeValues: {
        ":rut": rut,
        ":subject": "SUBJECT#"
      },
      TableName: 'alumnos'
    };

    try {
      return await dynamoDB.query(params).promise();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async getAllStudentsSubjects(query: string): Promise<any> {
    const params = {
      TableName: "alumnos",
      FilterExpression: "begins_with(#profile, :subject)",
      ExpressionAttributeNames: {
        "#profile": "PROFILE",
      },
      ExpressionAttributeValues: {
        ":subject": "SUBJECT#",
      }
    }

    try {
      if (Object.keys(query)[0] === 'subjects') {
        return await dynamoDB.scan(params).promise();
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async createSubjectByStudent(subject: Subject): Promise<any> {

    const my_uuid = uuid();
    subject.PROFILE = `SUBJECT#${my_uuid}`;

    const subjectObj = {
      id: my_uuid,
      ...subject,
    };

    try {
      return await dynamoDB
        .put({
          TableName: "alumnos",
          Item: subjectObj,
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}