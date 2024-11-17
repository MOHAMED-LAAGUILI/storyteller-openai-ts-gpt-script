import { Frame } from "@gptscript-ai/gptscript";

const renderEventMessage = (event: Frame) => {
  switch (event.type) {
    case "runStart":
      return <div> Run started at: {event.start}</div>;
    case "callStart":
      return (
        <div>
          <p> Tool starting: {event.tool?.description}</p>
        </div>
      );
    case "callChat":
      return (
        <div>
          Chat in progress with your input {">>"} {String(event.input)}
        </div>
      );
    case "callProgress":
      return null;
    case "callFinish":
      return (
        <div>
          Call finish:{" "}
          {event.output?.map((output) => (
            <div key={output.content}>{output.content}</div>
          ))}
        </div>
      );

    case "runFinish":
      return <div>Run finished at {event.end}</div>;

    case "callSubCalls": 
    case "callContinue":
    case "callConfirm":
      return (
        <div>
          Sub-calls in progress:
          {event.output?.map((output, index) => (
            <div key={index}>
              <div>{output.content}</div>
              {output.subCalls &&
                Object.keys(output.subCalls).map((subCallKey) => (
                  <div key={subCallKey}>
                    <strong>SubCall {subCallKey}</strong>
                    <div>Tool ID: {output.subCalls[subCallKey].toolID}</div>
                    <div>Input: {output.subCalls[subCallKey].input} </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      );
      default:
        return <pre>{JSON.stringify(event,null,2)}</pre>
  }
};

export default renderEventMessage;
