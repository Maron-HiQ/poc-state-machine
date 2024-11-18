import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CDKContext } from "../bin/config/types";
import {
  DefinitionBody,
  Fail,
  StateMachine,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { getLambdaAndTask } from "../src/util/LambdaAndTask";

export class PoCStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    context?: CDKContext
  ) {
    super(scope, id, props);

    const ID = `${+new Date()}-${Math.random()}`.replace(/\./g, "");

    // Define an error state
    const errorState = new Fail(this, "ErrorState", {
      comment: "Error on initializing the Payroll Run",
      errorPath: "$.Error",
      causePath:
        "States.Format('this is the error: {}, and this is the cause: {}', $.Error, $.Cause)",
    });

    // Define a fail state
    const failState = new Fail(this, "FailState", {
      comment: "Failed Payroll Run",
      errorPath: "$.Error",
      causePath:
        "States.Format('this is the error: {}, and this is the cause: {}', $.Error, $.Cause)",
    });

    /**  Lambdas and Tasks **/

    const { task: initialValidator } = getLambdaAndTask(
      this,
      "InitialValidator"
    );
    initialValidator.addCatch(errorState);

    const { task: enricher } = getLambdaAndTask(this, "Enricher");
    enricher.addCatch(errorState);

    const { task: validator } = getLambdaAndTask(this, "Validator");
    validator.addCatch(errorState);

    const { task: slicer } = getLambdaAndTask(this, "Slicer");
    slicer.addCatch(errorState);

    const { lambda: pricing } = getLambdaAndTask(this, "Pricing");

    /** MAP BLOCK  **/
    const mapBlock = new cdk.aws_stepfunctions.Map(
      this,
      "Transform Map Process",
      {
        maxConcurrency: 5,
        itemsPath: "$.payrollRunData",
        resultPath: "$.payrollRunDataOutput",
      }
    );

    /** MAP ITERATOR **/
    const pricingIterator = new cdk.aws_stepfunctions_tasks.LambdaInvoke(
      this,
      "transform-iterator-fn",
      {
        lambdaFunction: pricing,
      }
    );
    pricingIterator.addCatch(failState);

    /**  Leaf states (not Jamaica) **/

    // Define a Succeed state
    const succeedState = new Succeed(this, "SucceedState");

    /** Pink Floyd: Welcome to the (State) Machine **/

    // Define the state machine
    const stateMachine = new StateMachine(this, "PoCStateMachine", {
      definitionBody: DefinitionBody.fromChainable(
        initialValidator
          .next(enricher)
          .next(validator)
          .next(slicer)
          .next(mapBlock.itemProcessor(pricingIterator)) // It can be a chain, with different sequential Lambda calls
          .next(succeedState)
      ),
    });

    // Stack outputs
    new cdk.CfnOutput(this, "PoC-State-Machine", {
      value: stateMachine.stateMachineArn,
      exportName: `${context?.appName}-poc-state-machine-${context?.environment}`,
    });
  }
}
