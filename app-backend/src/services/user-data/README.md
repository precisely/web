# Controlling Access to Sensitive Health Data

The `UserData` class permits access to sensitive heath data. Cognito stores personally identifiable information. Each user has an id in Cognito, which is referred to as the `userId`. Other tables store health data under a different id, called the `opaqueId`.

The `DataBridge` model represents a DynamoDB table which maps userIds to opaqueIds for different data types. A user will have one userId and many opaqueIds, one for each data type.

The running system is designed so that the `DataBridge` table is only accessed by a custom authorizer lambda function prior to calling the graphQL handler.

The sequence of steps is:

1. User logs into the system via Cognito
  Browser stores the identity, refresh, and access tokens it receives from Cognito

2. User attempts to view report which requires personalized data
  Incoming request contains Cognito identity token

3. APIGateway verifies token via Cognito User pool

4. If successful, APIGateway calls custom authorizer

5. Custom authorizer lambda retrieves opaqueIds from DataBridge
  Note that only the custom authorizer is given rights to the DataBridge table, and then only for the specific user.

  It returns a policy document which gives access to other Dynamo tables based on the available opaqueIds.

6. The opaqueIds are passed to the UserData object
