import readline from "node:readline/promises";
import Groq from "groq-sdk";
import{tavily} from "@tavily/core";
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({apiKey:process.env.GROQ_API_KEY});
async function main(){
    const rl = readline.createInterface({input:process.stdin,output:process.stdout});
    const messages=[
            {
                role:'system',  
                content:`You are a smart personal assistant. Your task is to answer the asked questions.
                You have access to following tools:
                1.searchWeb({query}:{query:string}) //Search the latest information and realtime data on internet
                current date and time: ${new Date().toUTCString()}
                `,
                
            }
            // ,
            // {
            //     role:'user',
            //     content:`Q: What is the weather in india?`
            // }
        ]
        while(true){
            const question = await rl.question("Ask me Anything : ");
            //break in bye.
            if(question=='bye'){
                break;
            }
            messages.push({
                role:'user',
                content:question,
            })
            while(true){
         const completion = await groq.chat.completions.create({
        temperature:0,
        model:"llama-3.3-70b-versatile",
        messages:messages,
        tools:[
            {
                type:'function',
                function:{
                    name:'webSearch',
                    description:'Search the latest information and realtime data on internet',
                    parameters:{
                        type:'object',
                        properties:{
                            query:{
                                type:'string',
                                description:'The search query to perform search on'
                            },
                        },
                        required:['query'],
                        
                    },
                },
            },
        ],
        tool_choice:'auto'
    })
    //after 1st completion we have to push llm response in messages array for context
    messages.push(completion.choices[0].message);
    const toolCalls = completion.choices[0].message.tool_calls;
    if(!toolCalls){//means content is there
        console.log(`Assistant:${completion.choices[0].message.content}`);
        break;// exit loop
        // return;
    }
    for(const tool of toolCalls){
        console.log('tool',tool);
        const functionName = tool.function.name;
        const functionParams  = tool.function.arguments
        if(functionName=='webSearch'){
          const toolResult =await webSearch(JSON.parse(functionParams));
          // push in msg array for history
          messages.push({
            tool_call_id:tool.id,
            role:'tool',
            name:functionName,
            content:toolResult
          })
        //   console.log("Tool Result: ",toolResult);
          
        }
    }

    console.log(JSON.stringify(completion.choices[0].message,null,2));
            }
        }

    rl.close();
    }
   
//tavily api call
async function webSearch({query}){
    console.log('Calling WebSearch....')
    const response = await tvly.search(query);
    const finalResult = response.results.map((result)=>result.content).join('\n\n');
    return finalResult;
}
console.log(main());
