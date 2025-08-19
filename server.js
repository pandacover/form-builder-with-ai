import express from "express";
import cors from "cors";
import ollama from "ollama";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json({ limit: "50mb" }));

const ExampleField = `{
  name: {
    type: "text",
    label: "Name",
    placeholder: "John Doe",
  },
  email: {
    type: "email",
    label: "Email",
    placeholder: "john.doe@example.com",
  },
}`;

const ExampleSections = `[
  {
    rows: [
      {
        columns: ["name", "email"],
      },
    ],
  },
  {
    rows: [
      {
        columns: ["name"],
      },
      {
        columns: ["email"],
      },
    ],
  },
]`;

const fieldSchema = z.object({
  name: z.string(),
  type: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

const FormConfig = z.object({
  fields: z.record(z.string(), fieldSchema), // keys = generated IDs
  sections: z.array(
    z.object({
      rows: z.array(
        z.object({
          columns: z.array(z.string()), // store generatedId references here
        })
      ),
    })
  ),
});

app.post("/", async (req, res) => {
  const { prompt } = req.body;

  const promptWithContext = `${prompt}\nExample fields: ${ExampleField}\nExample sections: ${ExampleSections}};`;

  const request = {
    model: "gemma3:4b",
    prompt: promptWithContext,
    stream: false,
    format: zodToJsonSchema(FormConfig),
  };

  const response = await ollama.generate(request);
  console.log(response);
  res.jsonp(response);
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
