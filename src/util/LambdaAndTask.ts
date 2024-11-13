import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";

export interface LambdaAndTask {
  lambda: cdk.aws_lambda_nodejs.NodejsFunction;
  task: cdk.aws_stepfunctions_tasks.LambdaInvoke;
}

export const getLambdaAndTask = (
  stack: cdk.Stack,
  name: string
): LambdaAndTask => {
  const lambda = new NodejsFunction(stack, `${name}Lambda`, {
    runtime: Runtime.NODEJS_20_X,
    entry: `src/lambdas/${name}.ts`,
    handler: "handler",
  });

  const task = new LambdaInvoke(stack, `${name}Task`, {
    lambdaFunction: lambda,
    outputPath: "$.Payload",
  });

  return { task, lambda };
};
