# aws-import

It is a script to help an import to DynamoDB from a JSON file.
it automatically splits a data to chunks.
Can be used with local DynamoDB, localstack or AWS cloudshell.

## How to use

### Install globally
```bash
npm i -g aws-import
```

Run in CloudShell or locally

```bash
aws-import file=sample.json
```

Use to split a source json to chunks

```bash
aws-import file=sample.json split
```

## Options
### file=sample.json 
    - source json file
    - optional
    if json file is unique in the directory, it can be omitted.

### region=eu-west-1
    - AWS region
    - optional
    default: eu-west-1

### endpoint=http://localhost:4566
    - DynamoDB endpoint
    - optional
    default for local: http://localhost:4566
    default for aws cloudshell: https://dynamodb.<region>.amazonaws.com

### split=25
    - split a source json to chunks
    - optional
    - number of rows in a chunk (by default 25)
    default: false
    when split is specified, it will split a source json to chunks only
    Files will be numbered with -001, -002, -003, etc. pattern

### table=TableName
    You can specify a table name to import data to.
    Specifiing a table name will override the table name in the json file.


# Export in CloudShell of AWS
If you want to export a DynamoDB table to a JSON file, you can use the following command:

```bash
aws dynamodb scan --table-name TABLE_NAME > export.json
```