from transformers import BartTokenizer, BartForConditionalGeneration, Text2TextGenerationPipeline
tokenizer = BartTokenizer.from_pretrained("Kaludi/chatgpt-gpt4-prompts-bart-large-cnn-samsum")
model = BartForConditionalGeneration.from_pretrained("Kaludi/chatgpt-gpt4-prompts-bart-large-cnn-samsum", from_tf=True)
text2text_generator = Text2TextGenerationPipeline(model, tokenizer)
result = text2text_generator("programmer", do_sample=False)
print(result)