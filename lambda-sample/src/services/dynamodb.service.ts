import {DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, ScanCommandOutput} from "@aws-sdk/client-dynamodb";
import {AwsConfig} from "@common/models/aws-config";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";

export class DynamodbService {

    private readonly dynamoClient: DynamoDBClient;

    constructor(awsConfig: AwsConfig) {
        this.dynamoClient = new DynamoDBClient(awsConfig);
    }

    async getContactsList(): Promise<number[]> {

        let result: ScanCommandOutput = await this.dynamoClient.send(new ScanCommand({
            TableName: 'AddressBook',
            ProjectionExpression: 'id'
        }));

        return result.Items?.map(item => unmarshall(item).id) ?? [];
    }
}
