import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandOutput
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AwsConfig } from '@common/models/aws-config';

export class DynamodbService {
  private readonly dynamoClient: DynamoDBClient;

  constructor(awsConfig: AwsConfig) {
    this.dynamoClient = new DynamoDBClient(awsConfig);
  }

  async getContactsList(): Promise<number[]> {
    let result: ScanCommandOutput = await this.dynamoClient.send(
      new ScanCommand({
        TableName: 'AddressBook',
        ProjectionExpression: 'id',
      })
    );

    return result.Items?.map((item) => unmarshall(item).id) ?? [];
  }

  // async getContact(): Promise<unknown> {
  //   const input = {
  //     Key: {

  //     TableName: 'AddressBook',
  //   };

  //   let result: GetItemCommandOutput = await this.dynamoClient.send(
  //     new GetItemCommand(input)
  //   );

  //   return {};
  // }
}
