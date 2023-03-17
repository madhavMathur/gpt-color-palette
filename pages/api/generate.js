import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const userInput = req.body.userInput || '';
  if (userInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid phrase",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(userInput),
      temperature: 0.3,

    });

    // extract hex codes from generated text
    const hexRegex = /#(?:[0-9a-fA-F]{3}){1,6}/g;
    console.log(completion.data.choices[0].text)
    const hexCodes = completion.data.choices[0].text.match(hexRegex);

    // check if hexCodes is null or undefined
    if (hexCodes) {
      // log the hex codes
      console.log(hexCodes);
      res.status(200).json({ result: hexCodes });
    } else {
      console.log("No hex codes found in generated text.");
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(userInput) {
  return `"Generate hex color codes that describe the input phrase: ${userInput}."`;
}
