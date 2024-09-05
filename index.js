const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

require("dotenv").config();

// Configure the OpenAI client with your API key
const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

// Define an async function to interact with the OpenAI API
const getGPTResponse = async (body) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // You can use other models like 'gpt-4'
      messages: [
        {
          role: "system",
          content:
            "Rewrite the following headline to be factual and less sensational. Make sure to keep the headline six words or less:",
        },
        {
          role: "user",
          content: `Headline: ${body.headline}`,
        },
      ],
    });
    return response.choices[0].message;
  } catch (error) {
    console.error("Error contacting OpenAI:", error);
  }
};

// Enable CORS with specific options
app.use(
  cors({
    origin: "https://www.foxnews.com", // Replace with your specific domain or use '*' for all domains
    methods: ["GET", "POST", "OPTIONS"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Handle preflight OPTIONS requests
app.options("*", cors());

// Define POST endpoint
app.post("/", async (req, res) => {
  console.log(req.body);
  const response = await getGPTResponse(req.body);
  res.json(response);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
