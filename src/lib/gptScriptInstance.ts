import { GPTScript } from "@gptscript-ai/gptscript";



const g = new GPTScript({
    APIKey: process.env.OPEN_AI_API_KEY,
    
});


export default g;