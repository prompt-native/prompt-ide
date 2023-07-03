import csv
import json

# see:https://cloud.google.com/vertex-ai/docs/generative-ai/models/tune-models#generative-ai-tune-model-console

def generate_tuning_data():
    tuning_lines = []
    with open('prompts.csv', encoding="utf8") as csv_file:
        reader = csv.reader(csv_file, dialect=csv.excel)
        next(reader, None)
        for (persona, prompt) in reader:
            tuning_line = generate_prompt(persona, prompt)
            tuning_lines.append(tuning_line)

    with open("tuning_data.jsonl", "w", encoding="utf8") as outfile:
        for line in tuning_lines:
            json_line = json.dumps(line, ensure_ascii=False)
            outfile.write(json_line)
            outfile.write('\n')

PROMPT_TEMPLATE = """Assume you are a GPT expert, you understand GPT and other LLM models well.
I'll give you a persona that the user want's GPT to play with,
and you should generate proper prompt that will make GPT to behavie as it.

persona: %s
prompt:
"""

def generate_prompt(persona, output_template):
    return {
        "input_text": PROMPT_TEMPLATE % (persona),
        "output_text": output_template
    }

if __name__ == '__main__':
    generate_tuning_data()