## Description

Student API which defines a REST API with a Students + Subjects CRUD. It has endpoint to search students by rut, and subjects associated to a student by rut, in addition to basic CRUD operations.

The service has public and private endpoints protected by an apyKey.

It works with Node + NestJS, DynamoDB database and is available in the cloud through AWS Lambda.

## Requirements

- NodeJS
- Serverless Framework

## Git Clone

```bash
git clone https://github.com/zerpajose/students_API_dynamoDB.git
```

## Environment Configuration

Create a ```.env``` file in your root folder project, then copy the configuration variables from ```.env.sample``` file.

## Project Installation

```bash
npm install
```

## Running the app

```bash
# run unit tests
npm run test

# build & deploy to AWS Lambda
npm run build && sls deploy

# build & run to localhost
npm run build && sls offline start
```

## API Documentation
### Local
[http://localhost:3000/dev/docs](http://localhost:3000/dev/docs)

### AWS Lambda
[https://mqckmegh7b.execute-api.us-east-1.amazonaws.com/dev/docs](https://mqckmegh7b.execute-api.us-east-1.amazonaws.com/dev/docs)

## API Demo (AWS)
[https://mqckmegh7b.execute-api.us-east-1.amazonaws.com/dev/docs](https://mqckmegh7b.execute-api.us-east-1.amazonaws.com/dev/docs)

## Stay in touch

- Author - [Jose Zerpa](https://vincentdev.xyz)
- Twitter - [@zerpajose](https://twitter.com/zerpajose)