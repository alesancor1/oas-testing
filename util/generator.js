import { faker } from "@faker-js/faker";

export const validCodes = ["200", "201", "204", "400", "401", "403", "404", "500"];

export function generateTestData(OasDoc) {
    const result = {};
    const paths = OasDoc.paths;
    const pathParamRegex = /{([^}]+)}/g;

    for (const [path, operations] of Object.entries(paths)) {
        if (!result[path]) result[path] = {};
        for (const [operation, operationObj] of Object.entries(operations)) {
            if (!result[path][operation]) result[path][operation] = {};    
            if (["GET", "POST", "PUT", "DELETE"].includes(operation.toUpperCase())){
                for (const response in operationObj.responses) {
                    if (validCodes.includes(response)) {
                        const contentType = Object.keys(operationObj.responses[response].content ?? {})?.[0];
                        const schema = operationObj.responses[response].content?.[contentType]?.schema;
                        
                        if (schema) result[path][operation][response] = { response: generateExample(schema) };
                        else result[path][operation][response] = { response: null };
    
                        if (pathParamRegex.test(path)) {
                            if (!result[path][operation]['path']) result[path][operation]['path'] = {};

                            path.match(pathParamRegex).forEach((param) => {
                                const paramName = param.replace("{", "").replace("}", "");
                                if (parseInt(response) === 200) {                                      
                                    result[path][operation]['path'][paramName] = result[path][operation][response].response?.[paramName];
                                } else if (parseInt(response) === 400){
                                    result[path][operation]['path'][paramName] = "BAD_REQUEST";
                                } else if (parseInt(response) === 401){
                                    result[path][operation]['path'][paramName] = "UNAUTHORIZED";
                                } else if (parseInt(response) === 403){
                                    result[path][operation]['path'][paramName] = "FORBIDDEN";
                                } else if (parseInt(response) === 404){
                                    result[path][operation]['path'][paramName] = "NOT_FOUND";
                                } else if (parseInt(response) === 500){
                                    result[path][operation]['path'][paramName] = "INTERNAL_SERVER_ERROR";
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    return result;
}

function generateExample(schema) {
    if (schema.type === "object") {
        const result = {};
        for (const [prop, propSchema] of Object.entries(schema.properties)) {
            if (schema.required?.includes(prop) ?? false) {
                result[prop] = generateExample(propSchema);
            } else if (faker.datatype.boolean()) {
                result[prop] = generateExample(propSchema);
            }
        }
        return result;
    } else if (schema.type === "array") {
        const result = [];
        for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
            result.push(generateExample(schema.items));
        }
        return result;
    } else if (schema.type === "string") {
        if (schema.format === "date-time") {
            return faker.date.recent().toISOString();
        } else if (schema.format === "date") {
            return faker.date.recent().toISOString().split("T")[0];
        } else if (schema.format === "time") {
            return faker.date.recent().toISOString().split("T")[1];
        } else if (schema.format === "email") {
            return faker.internet.email();
        } else if (schema.format === "hostname") {
            return faker.internet.domainName();
        } else if (schema.format === "ipv4") {
            return faker.internet.ip();
        } else if (schema.format === "ipv6") {
            return faker.internet.ipv6();
        } else if (schema.format === "uri") {
            return faker.internet.url();
        } else if (schema.format === "uuid") {
            return faker.string.uuid();
        } else if (schema.format === "binary") {
            return faker.string.binary();
        } else if (schema.format === "byte") {
            return faker.string.octal();
        } else if (schema.format === "password") {
            return faker.internet.password();
        } else {
            return faker.string.alpha({ length: { min: schema.minimum ?? 1, max: schema.maximum ?? 10 } });
        }
    } else if (schema.type === "number") {
        if (schema.format === "float") {
            return faker.number.float();
        } else if (schema.format === "double") {
            return faker.number.float();
        } else {
            return faker.number.float();
        }
    } else if (schema.type === "integer") {
        if (schema.format === "int32") {
            return faker.number.int();
        } else if (schema.format === "int64") {
            return faker.number.int();
        } else {
            return faker.number.int();
        }
    } else if (schema.type === "boolean") {
        return faker.datatype.boolean();
    }
}