import renderEventMessage from "../lib/renderEventMessage";
import { useState } from "react";

const StoryWriter = () => {
  const storyPath = "public/stories";
  const [story, setStory] = useState("");
  const [pages, setPages] = useState(5);
  const [progress, setProgress] = useState("");
  const [runStarted, setRunStarted] = useState(false);
  const [runFinished, setRunFinished] = useState(null);
  const [currentTool, setCurrentTool] = useState("");
  const [events, setEvents] = useState([]);

  async function runScript() {
    setRunStarted(true);
    setRunFinished(false);
    setProgress(""); // Reset progress on new run
    setEvents([]); // Clear previous events

    try {
      const response = await fetch("/api/run-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story, pages, path: storyPath }),
      });

      if (response.ok && response.body) {
        console.log("Streaming started");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        await handleStream(reader, decoder);
      } else {
        console.error("Streaming failed");
        setRunStarted(false);
        setRunFinished(false);
        setProgress("Failed to start streaming.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setRunStarted(false);
      setRunFinished(false);
      setProgress("An error occurred while running the script.");
    }
  }

  async function handleStream(reader, decoder) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log("Chunk received:", chunk);

        const eventData = chunk
          .split("\n\n")
          .filter((line) => line.startsWith("event: "))
          .map((line) => JSON.parse(line.replace(/^event: /, "")));

        eventData.forEach((data) => {
          try {
            if (data.type === "callProgress") {
              setProgress((prev) => data.output[data.output.length - 1].content);
              setCurrentTool(data.tool?.description || "");
            } else if (data.type === "callStart") {
              setCurrentTool(data.tool?.description || "");
            } else if (data.type === "runFinish") {
              setRunFinished(true);
              setRunStarted(false);
            } else {
              setEvents((prevEvents) => [...prevEvents, data]);
            }
          } catch (error) {
            console.log("Error processing event data:", error);
          }
        });
      }
    } catch (error) {
      console.log("Stream handling error:", error);
    }
  }

  return (
    <>
      <p className="text-2xl sm:text-3xl font-semibold text-center lg:text-left text-gray-800 dark:text-gray-200 mb-6">
        Write your own stories and let the AI bring them to life.
      </p>

      <section className="w-full space-y-6">
        <textarea
          cols="30"
          rows="6"
          value={story}
          onChange={(e) => setStory(e.target .value)}
          className="w-full p-4 rounded-lg border-2 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ease-in-out mb-6"
          placeholder="Start writing your story here... unleash your imagination and let AI amaze you"
        ></textarea>

        <div className="w-full space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-200">
            How many pages should the story be?
          </p>
          <select
            className="w-full p-3 rounded-lg border-2 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            defaultValue="5"
            onChange={(e) => setPages(parseInt(e.target.value))}
          >
            <option value="5">5 pages</option>
            <option value="10">10 pages</option>
            <option value="15">15 pages</option>
            <option value="20">20 pages</option>
            <option value="25">25 pages</option>
            <option value="30">30 pages</option>
          </select>
        </div>

        <button
          disabled={!story || !pages || runStarted}
          className="w-full bg-yellow-300 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={runScript}
        >
          🤖 Generate Story 💭
        </button>
      </section>

      {/* Chat Output Section */}
      <section className="flex-1 mt-8 w-full">
        <div className="flex flex-col-reverse h-96 overflow-y-auto rounded-md bg-gray-50 dark:bg-gray-700 p-4 shadow-md">
          {runFinished === null && (
            <p className="animate-pulse text-gray-700 dark:text-gray-200 text-center">
              Waiting for you to generate the story...
            </p>
          )}

          <span className="text-lg text-gray-600 dark:text-gray-400 block text-center">
            {"<<"}
          </span>

          {/* Story Progress */}
          {progress && (
            <div className="text-gray-700 dark:text-gray-300 text-center">
              {progress}
            </div>
          )}

        {currentTool && (
          <div className="mt-4 text-gray-700 dark:text-gray-200 text-center">
            <span className="font-semibold">{"--- [Current Tool] ---"}</span>
            <div>{currentTool}</div>
          </div>
        )}

        {/* Render Events */}
        <div>
          {events.map((event, index) => (
            <div key={index}>
              <span>{">>>"}</span>
              {renderEventMessage(event)}
            </div>
          ))}
        </div>

        {runStarted && (
          <div className="mt-4 text-gray-700 dark:text-gray-200 text-center">
            <span className="font-semibold">
              {"--- [AI Story Teller Started] ---"}
            </span>
          </div>
        )}
        </div>
      </section>
    </>
  );
};

export default StoryWriter;