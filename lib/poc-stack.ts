import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CDKContext } from "../bin/config/types";
import {
  Chain,
  Choice,
  Condition,
  DefinitionBody,
  Fail,
  Pass,
  StateMachine,
  Succeed,
  Wait,
  WaitTime,
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

    /**  Lambdas and Tasks **/

    const { task: receiveOrdersTask } = getLambdaAndTask(this, "ReceiveOrder");
    const { task: checkStockTask } = getLambdaAndTask(this, "CheckStock");
    const { task: deliverOrderTask } = getLambdaAndTask(this, "DeliverOrder");
    const { task: billCustomerTask } = getLambdaAndTask(this, "BillCustomer");
    const { task: orderStockTask } = getLambdaAndTask(this, "OrderStock");

    /**  Leaf states (not Jamaica) **/

    // Define a Succeed state
    const succeedState = new Succeed(this, "SucceedState");

    // Define a Fail state
    const failState = new Fail(this, "FailState", {
      error: "Error: Item not available",
      causePath: "States.JsonToString($.message)",
    });

    /**  Intermediate states **/

    // Define a wait state (it will wait this time to advance to the next step)
    const waitState = new Wait(this, "WaitState", {
      time: WaitTime.duration(cdk.Duration.seconds(5)),
    });

    /**  Chains (not the ones Alice is in) **/

    const successChain = waitState
      .next(deliverOrderTask)
      .next(billCustomerTask)
      .next(succeedState);

    const failChain = orderStockTask.next(failState);

    /**  STATES (not United) (not from America) **/

    // Adding a timestamp
    const addTimestampState = new Pass(this, "AddTimestampState", {
      parameters: {
        "order.$": "$.order",
        "message.$": "$.message",
        "timestamp.$": "$$.State.EnteredTime",
      },
      resultPath: "$",
    });

    // Define a Choice state
    const choiceState = new Choice(this, "ChoiceState");
    choiceState.when(Condition.numberEquals("$.status", 0), failChain);
    choiceState.when(Condition.numberEquals("$.status", 1), successChain);

    /** Pink Floyd: Welcome to the (State) Machine **/

    // Define the state machine
    const stateMachine = new StateMachine(this, "StateMachine", {
      definitionBody: DefinitionBody.fromChainable(
        receiveOrdersTask
          .next(addTimestampState)
          .next(checkStockTask)
          .next(choiceState)
      ),
    });

    // Stack outputs
    new cdk.CfnOutput(this, "State-Machine", {
      value: stateMachine.stateMachineArn,
      exportName: `${context?.appName}-state-machine-${context?.environment}`,
    });
  }
}
