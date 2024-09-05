const OpenAI = require("openai");

const express = require("express");
// const cors = require("cors");
const app = express();
const PORT = 3000;

// app.use(cors());

require("dotenv").config();

// Configure the OpenAI client with your API key
const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

// Define an async function to interact with the OpenAI API
const getGPTResponse = async (body) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // You can use other models like 'gpt-4'
      messages: [
        {
          role: "system",
          content:
            "You are an expert headline editor for a dynamic news platform. Based on the user's request, you will transform headlines in one of three ways: If the type is 'No More Clickbait!': Rewrite the given headline to be as factual, neutral, and non-sensational as possible. Aim for clarity and truthfulness over engagement. If the type is 'Even More Clickbait!': Amplify the sensationalism in the headline. Make it more provocative, exaggerated, or emotionally charged to grab attention, even at the cost of some accuracy or subtlety. If the type is 'Just Having Some Fun': Transform the headline into a satirical version suitable for a site like The Babylon Bee. Keep it humorous, ironic, or absurd while still relating to the original content.",
        },
        {
          role: "user",
          content: `Headline: ${body.headline}, Type: ${body.type}`,
        },
      ],
    });
    return response.choices[0].message;
  } catch (error) {
    console.error("Error contacting OpenAI:", error);
  }
};

// will parse JSON bodies from post request for all requests made
app.use(express.json());

app.post("/", async (req, res) => {
  console.log(req.body);
  const response = await getGPTResponse(req.body);
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
