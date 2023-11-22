export const COMPLETION_SCHEMA = {
    $schema: "http://json-schema.org/schema",
    type: "object",
    additionalProperties: false,
    properties: {
        $schema: {
            type: "string",
        },
        version: {
            type: "string",
            description: "The schema version",
        },
        type: {
            type: "string",
            enum: ["completion"],
            markdownDescription:
                "Define the prompt type. You can use:\n * `chat`: prompt used to initiate open-ended conversations with LLM\n * `completion`: prompt used to guide users towards specific actions or responses",
        },
        engine: {
            type: "string",
            description: "Model engine that is expected to use",
        },
        prompt: {
            type: "string",
            description: "This field is valid only when type is completion.",
        },
        parameters: {
            type: "array",
            items: {
                $ref: "#/definitions/parameter",
            },
            description: "LLM parameters.",
        },
    },
    required: ["version", "engine", "prompt"],
    definitions: {
        parameter: {
            "additionalProperties ": false,
            "properties": {
                name: {
                    type: "string",
                    pattern: "^[a-z]+(_[a-z]+)*$",
                    description: "Name of parameter",
                },
                value: {
                    type: ["string", "number", "boolean"],
                    description: "Value of this parameter",
                },
            },
            "required": ["name", "value"],
        },
    },
};
