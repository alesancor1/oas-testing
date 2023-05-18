# OAS Testing

This packege generates scaffolding and test cases from OpenAPI 3.0 spec document.

## CLI

A command line interface is available to generate scaffolding and test cases with npx.

```
npx oas-testing generate [options] <spec>
```

| Option | Required | Description |
| --- | --- | --- |
| --host <host> | Yes |target hostname to use in test generation |
| --values-file <path> | No | path to values file following [oatts format](https://github.com/google/oatts/blob/master/test/process/documents/customValuesTest.json)|
| -o, --output <output> | No | output directory (default: "test")|
| -V, --version | -- |output the version number |
| -h, --help | -- |output usage information |
