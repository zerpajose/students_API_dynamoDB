import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';
import { Subject } from './entities/subject.interface';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

const dynamoDB = process.env.IS_OFFLINE
  ? new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: process.env.DYNAMODB_ENDPOINT,
  })
  : new AWS.DynamoDB.DocumentClient();

@Injectable()
export class SubjectsService {

  async create(rut: string, subject: CreateSubjectDto): Promise<any> {

    const querySubject = {
      "TableName": "alumnos",
      "ConsistentRead": false,
      "FilterExpression": "#subjectName = :subjectName",
      "ProjectionExpression": "#subjectId",
      "ExpressionAttributeValues": {
        ":subjectName": subject.subjectName
      },
      "ExpressionAttributeNames": {
        "#subjectId": "id",
        "#subjectName": "subjectName"
      }
    }
    try {
      const data_id = await dynamoDB.scan(querySubject).promise();

      let my_uuid;
      if(data_id.Count === 0){
        my_uuid = uuid();
        subject.PROFILE = `SUBJECT#${my_uuid}`;
      }
      else{
        my_uuid = data_id.Items[0].id;
        subject.PROFILE = `SUBJECT#${my_uuid}`;
      }

      const subjectObj = {
        id: my_uuid,
        RUT: rut,
        ...subject,
      };

      return await dynamoDB
        .put({
          TableName: "alumnos",
          Item: subjectObj,
        })
        .promise();
      
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async findAll(): Promise<any> {
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
      return await dynamoDB.scan(params).promise();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(rut: string): Promise<any> {
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

  async update(rut: string, subject: UpdateSubjectDto, subjectName: string): Promise<any> {
    const params = {
      TableName: "alumnos",
      Key: {
        RUT: rut,
        PROFILE: `SUBJECT#${rut}`
      },
      ConditionExpression: "#subjectOldName = :subjectOldName",
      UpdateExpression: "SET #subjectNewName = :subjectNewName, #subjectMark = :subjectMark",
      ExpressionAttributeValues: {
        ":subjectNewName": subject.subjectName,
        ":subjectMark": subject.subjectMark,
        ":subjectOldName": subjectName
      },
      ExpressionAttributeNames: {
        "#subjectNewName": "subjectName",
        "#subjectMark": "subjectMark",
        "#subjectOldName": "subjectName"
      }
    }

    try {
      return await dynamoDB.update(params).promise();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async remove(rut: string, subjectName: string): Promise<any> {

    const querySubject = {
      "TableName": "alumnos",
      "ConsistentRead": false,
      "FilterExpression": "#subjectName = :subjectName",
      "ProjectionExpression": "#subjectId",
      "ExpressionAttributeValues": {
        ":subjectName": subjectName
      },
      "ExpressionAttributeNames": {
        "#subjectId": "id",
        "#subjectName": "subjectName"
      }
    }
    try {
      const data_id = await dynamoDB.scan(querySubject).promise();

      let my_uuid;
      if(data_id.Count === 0){
        return;
      }
      else{
        my_uuid = data_id.Items[0].id;
      }

      const deleteItemInput = {
        TableName: "alumnos",
        Key: {
          RUT: rut,
          PROFILE: `SUBJECT#${my_uuid}`
        }
      }

      return await dynamoDB.delete(deleteItemInput).promise();

    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}
