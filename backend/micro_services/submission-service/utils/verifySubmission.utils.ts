import MinioObjectReader from '../services/minio.service';
import config from '../../configs/dotenv.config';
import SubmissionService from '../services/submission.service';

const objectStore = new MinioObjectReader();
const submissionService = new SubmissionService();

export default class VerifySubmissionPipeline {
  private answerBucketName: string;
  private notebooksBucketName: string;
  private userId: string;
  private problemId: string;

  constructor(userId: string, problemId: string) {
    this.answerBucketName = config.ANSWERS_BUCKET_NAME;
    this.notebooksBucketName = config.NOTEBOOKS_BUCKET_NAME;
    this.userId = userId;
    this.problemId = problemId;
  }

  convertDataToMap(
    data: Record<string, unknown>[],
    variablesData: Record<string, string[]>
  ) {
    let map = new Map<string, unknown[]>();
    for (let item of data) {
      let compositeKeyArray = [];
      let compositeValueArray = [];

      for (let x of variablesData['X']) {
        compositeKeyArray.push(item[x]);
      }
      for (let y of variablesData['Y']) {
        compositeValueArray.push(item[y]);
      }

      let compositeKey = compositeKeyArray.join(';');

      map.set(compositeKey, compositeValueArray);
    }
    return map;
  }

  async compareUserSubmissionWithAnswer(
    answerData: Record<string, unknown>[],
    userSubmissionData: Record<string, unknown>[],
    variablesData: Record<string, string[]>,
    submissionId: string
  ) {
    let answerMap = this.convertDataToMap(answerData, variablesData);
    let userSubmissionMap = this.convertDataToMap(
      userSubmissionData,
      variablesData
    );

    let testCase = 1;
    for (let x of answerMap.keys()) {
      let answer = answerMap.get(x) as unknown[];
      let userSubmission = userSubmissionMap.get(x) as unknown[];

      let inputValues = x.split(';');
      let inputJson = Object.fromEntries(
        variablesData['X'].map((item, idx) => [item, inputValues[idx]])
      );

      if (!userSubmission) {
        await submissionService.updateSubmission({
          submissionId,
          status: 'ATTEMPTED',
          input: JSON.stringify(inputJson),
          output: JSON.stringify(
            Object.entries(variablesData['Y'].map((item) => [item, null]))
          ),
          expected: JSON.stringify(
            Object.entries(
              variablesData['Y'].map((item, idx) => [item, answer[idx]])
            )
          ),
        });

        return { success: false, message: `Test Case - ${testCase} Failed` };
      }

      let flag = true;
      for (let i = 0; i < answer.length; i++) {
        if (typeof answer[i] == 'string' || answer[i] instanceof String) {
          if (answer[i] != userSubmission[i]) {
            flag = false;
            break;
          }
        } else if (
          typeof answer[i] == 'number' ||
          answer[i] instanceof Number
        ) {
          let deviation =
            (Math.abs((answer[i] as number) - (userSubmission[i] as number)) /
              (answer[i] as number)) *
            100;
          if (deviation > 5) {
            flag = false;
            break;
          }
        }
      }

      if (!flag) {
        await submissionService.updateSubmission({
          submissionId,
          status: 'ATTEMPTED',
          input: JSON.stringify(inputJson),
          output: JSON.stringify(
            Object.entries(variablesData['Y'].map((item) => [item, null]))
          ),
          expected: JSON.stringify(
            Object.entries(
              variablesData['Y'].map((item, idx) => [item, answer[idx]])
            )
          ),
        });

        return {
          success: false,
          message: `Test Case - ${testCase} Failed`,
        };
      }
      testCase++;
    }
    await submissionService.updateSubmission({
      submissionId,
      status: 'ACCEPTED',
      input: undefined,
      output: 'All testcases passed',
      expected: undefined,
    });

    return {
      success: true,
      message: `All testcases passed`,
    };
  }

  async getSchema() {
    let schemaPath = `${this.problemId}/schema.json`;
    return await objectStore.getParsedJSONObject(
      this.answerBucketName,
      schemaPath
    );
  }

  async getVariables() {
    let schemaPath = `${this.problemId}/variables.json`;
    return await objectStore.getParsedJSONObject(
      this.answerBucketName,
      schemaPath
    );
  }

  async getUserSubmissionData(schema: Record<string, string>) {
    let submissionPath = `${this.userId}/${this.problemId}/submission.csv`;
    return await objectStore.getParsedCSVObject(
      this.notebooksBucketName,
      submissionPath,
      schema
    );
  }

  async getAnswerData(schema: Record<string, string>) {
    let answerCSVPath = `${this.problemId}/answer.csv`;
    return await objectStore.getParsedCSVObject(
      this.answerBucketName,
      answerCSVPath,
      schema
    );
  }

  async runPipeline() {
    let { submissionId } = await submissionService.addPendingSubmission(
      this.userId,
      this.problemId
    );

    // Get Schema from Object Store [ANSWERS]
    let {
      success: schemaSuccess,
      data: schemaData,
      message: schemaErrorMessage,
    } = await this.getSchema();

    if (!schemaSuccess) {
      await submissionService.updateSubmission({
        submissionId: submissionId,
        status: 'FAILED',
        input: undefined,
        output: schemaErrorMessage as string,
        expected: undefined,
      });
      return { success: false, message: schemaErrorMessage };
    }

    // Get Variables (depenedent and independent) from Object Store [ANSWERS]
    let {
      success: variablesSuccess,
      data: variablesData,
      message: variablesErrorMessage,
    } = await this.getVariables();

    if (!variablesSuccess) {
      await submissionService.updateSubmission({
        submissionId: submissionId,
        status: 'FAILED',
        input: undefined,
        output: variablesErrorMessage as string,
        expected: undefined,
      });
      return { success: false, message: variablesErrorMessage };
    }

    // Get answerData from Object Store [ANSWERS]
    let {
      success: answerSuccess,
      data: answerData,
      message: answerErrorMessage,
    } = await this.getAnswerData(schemaData);

    if (!answerSuccess) {
      await submissionService.updateSubmission({
        submissionId: submissionId,
        status: 'FAILED',
        input: undefined,
        output: answerErrorMessage as string,
        expected: undefined,
      });
      return { success: false, message: answerErrorMessage };
    }

    // Get userSubmissionData from Object Store [NOTEBOOKS]
    let { success: userSubmissionSuccess, data: userSubmissionData } =
      await this.getUserSubmissionData(schemaData);

    if (!userSubmissionSuccess) {
      await submissionService.updateSubmission({
        submissionId: submissionId,
        status: 'FAILED',
        input: undefined,
        output: 'Failed to parse user submission',
        expected: undefined,
      });
      return { success: false, message: 'Failed to parse user submission' };
    }

    // Compare values between answer and userSubmission
    return await this.compareUserSubmissionWithAnswer(
      answerData,
      userSubmissionData,
      variablesData,
      submissionId
    );
  }
}
