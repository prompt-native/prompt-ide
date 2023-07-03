import axios from "axios";
import { Chat, Completion, Vendor, getModels } from "..";

export class Response {
    constructor(
        public success: boolean,
        public content: string,
    ) { }
}

export interface PromptExecutor {
    isSupported(prompt: Chat | Completion): boolean;
    execute(prompt: Chat | Completion): Promise<Response>;
}

/* 
{
    "instances": [
        {
            "content": "generate a name for my dog"
        }
    ],
    "parameters": {
        "temperature": 0.2,
        "maxOutputTokens": 256,
        "topP": 0.8,
        "topK": 40
    }
}
*/

/*
{
  "predictions": [
    {
      "citationMetadata": {
        "citations": []
      },
      "safetyAttributes": {
        "categories": [],
        "blocked": false,
        "scores": []
      },
      "content": "* **Buddy** is a classic name for a dog that is friendly and loyal.\n* **Max** is a strong and masculine name that is perfect for a big dog.\n* **Charlie** is a playful and energetic name that is perfect for a small dog.\n* **Bailey** is a sweet and gentle name that is perfect for a female dog.\n* **Cooper** is a smart and independent name that is perfect for a male dog."
    }
  ]
}
*/

export class VertexContent {
    constructor(
        public content: string
    ) {

    }
}

export class VertexCompletionResponse {
    constructor(
        public predictions: VertexContent[],
    ) { }
}

export class VertexCompletionRequest {
    constructor(
        public instances: VertexContent[],
        public parameters: Record<string, number | string | boolean>,
    ) { }

    static create(content: string, parameters: Record<string, number | string | boolean>): VertexCompletionRequest {
        return new VertexCompletionRequest([new VertexContent(content)],
            parameters);
    }
};

export class LogEvent {
    constructor(
        public time: Date,
        public level: string,
        public data: string,
    ) { }
}

export interface LogEventListener {
    onLogEvent(event: LogEvent);
}

export class GoogleExecutor implements PromptExecutor {
    constructor(
        private token: string,
        private logger: LogEventListener,
    ) { }

    isSupported(prompt: Chat | Completion): boolean {
        return prompt.model.model in getModels(prompt.type, Vendor.Google);
    }

    async execute(prompt: Chat | Completion): Promise<Response> {
        let parameters: Record<string, number | string | boolean> = {};
        prompt.parameters?.forEach(p => {
            parameters[p.name] = p.value;
        });

        const body = VertexCompletionRequest.create(Completion.getFinalPrompt(prompt as Completion),
            parameters);
        this.logger.onLogEvent(new LogEvent(new Date(), "info", `Sending request, ${JSON.stringify(body, null, 4)}`));
        try {
            const { data, status } = await axios.post<VertexCompletionResponse>(
                'https://us-central1-aiplatform.googleapis.com/v1/projects/soleelinux/locations/us-central1/publishers/google/models/text-bison@001:predict',
                body,
                {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": `Bearer ${this.token}`,
                    },
                },
            );
            this.logger.onLogEvent(new LogEvent(new Date(), "info", `Request complete, status=${status}`));
            this.logger.onLogEvent(new LogEvent(new Date(), "info", `Request complete, data=${JSON.stringify(data, null, 4)}`));

            return new Response(true, data.predictions[0].content);
        } catch (error) {
            console.log(error);
            this.logger.onLogEvent(new LogEvent(new Date(), "error", `Request error: ${error.message}`));
            return new Response(false, error.message);
        }
    }
}