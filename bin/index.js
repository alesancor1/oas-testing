#!/usr/bin/env node

import { generateTestData, validCodes } from "../util/generator.js";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { program } from "commander";
import oatts from "oatts"

program
    .name('oas-testing')
    .description('Generate test scaffolding from an OpenAPI specification')
    .usage('generate [options] <file>')
    .version('0.0.1')
    .showHelpAfterError()

program
    .command('generate <file>')
    .requiredOption('--host <host>', 'host to use for requests')
    .option('-o, --output <path>', 'output directory', 'test')
    .action((file, {output, host}) => {
        $RefParser.dereference(file).then((OasDoc) => {
            const testData = generateTestData(OasDoc);
            
            oatts.generate(file, {
                samples: true,
                host: host,
                writeTo: output,
                customValues: JSON.stringify(testData),
                statusCodes: validCodes,
            });

        }).catch((err) => {
            console.error(err);
        });
    });

program.parse(process.argv);