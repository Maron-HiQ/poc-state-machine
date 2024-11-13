#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PocStack } from "../lib/poc-stack";
import { CDKContext } from "./config/types";

import * as gitBranch from "git-branch";
// Get CDK Context based on git branch
export const getContext = async (app: cdk.App): Promise<CDKContext> => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentBranch = await gitBranch();
      console.log(`Current git branch: ${currentBranch}`);

      const environment = app.node
        .tryGetContext("environments")
        .find((e: any) => e.branchName === currentBranch);
      console.log("Environment: ");
      console.log(JSON.stringify(environment, null, 4));

      const globals = app.node.tryGetContext("globals");
      console.log("Globals: ");
      console.log(JSON.stringify(globals, null, 4));

      return resolve({ ...globals, ...environment });
    } catch (error) {
      console.error(error);
      return reject();
    }
  });
};

// Create stacks
const createStacks = async () => {
  try {
    const app = new cdk.App();
    const context = await getContext(app);

    const tags: any = {
      Environment: context.environment,
    };

    const stackName = `${context.appName}-stack-${context.environment}`;

    const stackProps: cdk.StackProps = {
      env: {
        region: context.region,
        account: context.accountNumber,
      },
      stackName: stackName,
      description: `This is the ${context.environment} stack description for ${context.appName} App`,
      tags,
    };

    new PocStack(app, stackName, stackProps, context);
  } catch (error) {
    console.error(error);
  }
};

// HERE BE DRAGONS
createStacks();
