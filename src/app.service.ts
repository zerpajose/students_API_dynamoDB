import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): object {
    return {
        students_url: "https://mqckmegh7b.execute-api.us-east-1.amazonaws.com/dev/students",
        subjects_url: "https://mqckmegh7b.execute-api.us-east-1.amazonaws.com/dev/subjects",
        api_docs__url: "https://mqckmegh7b.execute-api.us-east-1.amazonaws.com/dev/docs",
    };
  }
}
