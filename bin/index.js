#!/usr/bin/env node

import { generateTestData, validCodes } from "../util/generator.js";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { program } from "commander";
import oatts from "oatts"
import fs from "fs";

program
    .name('oas-testing')
    .description('Generate test scaffolding from an OpenAPI specification')
    .usage('generate [options] <file>')
    .version('0.0.1')
    .showHelpAfterError()

program
    .command('generate <file>')
    .requiredOption('--host <host>', 'host to use for requests')
    .option('--values-file <path>', 'path to a file containing custom values')
    .option('-o, --output <path>', 'output directory', 'test')
    .action((file, {output, host, valuesFile}) => {
        $RefParser.dereference(file).then((OasDoc) => {
            const testData = generateTestData(OasDoc);

            oatts.generate(file, {
                samples: true,
                host: host,
                writeTo: output,
                customValues: valuesFile ? fs.readFileSync(valuesFile, 'utf8') : JSON.stringify(testData),
                statusCodes: validCodes,
            });

        }).catch((err) => {
            console.error(err);
        });
    });

program.parse(process.argv);