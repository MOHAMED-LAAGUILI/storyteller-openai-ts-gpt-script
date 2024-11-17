import g from "../../../lib/gptScriptInstance";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import { NextRequest } from "next/server";
import path from 'path';
import fs from 'fs';

// Define the path to the script file
const script = path.join(process.cwd(), 'src/app/api/run-script/story-book.gpt');

export async function POST(request: NextRequest) {
    const { story, pages, path: outputPath } = await request.json();
    console.log("Received request:", { story, pages, outputPath });

    // Input validation
    if (!story || typeof story !== 'string' || pages <= 0 || !outputPath) {
        console.error("Invalid input:", { story, pages, outputPath });
        return new Response(JSON.stringify({ error: "Invalid input: story is required, pages must be greater than 0, and outputPath must be provided." }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Check if the script file exists
    if (!fs.existsSync(script)) {
        console.error("Script file does not exist at:", script);
        return new Response(JSON.stringify({ error: "Script file not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Set up options for running the script
    const opts: RunOpts = {
        disableCache: true,
        input: `--story ${story} --pages ${pages} --path ${outputPath}`,
    };

    console.log("Run options:", opts);

    try {
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Add Bearer authentication to the request
                    const runner = await g.run(script, opts);

                    runner.on(RunEventType.Event, (data) => {
                        console.log("Received data from model:", data);
                        controller.enqueue(
                            encoder.encode(`event: ${JSON.stringify(data)} \n\n`)
                        );
                    });

                    // Wait for the runner to finish
                    const result = await runner.text();
                    console.log("Final result:", result);
                    controller.enqueue(encoder.encode(`event: ${JSON.stringify({ result })} \n\n`));
                    controller.close(); // Close the stream only after successful completion
                } catch (error) {
                    console.error("Runner error:", error);
                    controller.enqueue(encoder.encode(`event: ${JSON.stringify({ error: error.message || "An error occurred while processing your request." })} \n\n`));
                    controller.close(); // Close the stream after handling the error
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            },
        });
    } catch (error) {
        console.error("POST error:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }),{
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}