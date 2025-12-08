import Groq from "groq-sdk";
const groq = new Groq({apiKey:process.env.GROQ_API_KEY});
async function main(){
    const completion = await groq.chat.completions.create({
        temperature:0,
        // stop:'GA',
        max_completion_tokens:120,
        model:"llama-3.3-70b-versatile",
        response_format:{
            type:'json_object',
        },
        messages:[
            {
                role:'system',
                // content:`You are rass a smart sentiment analysis tool.Your task is to analyse the given review and analyse the sentiment . CLASSIFY THE REVIEW AS POSITIVE , NEGATIVE OR NEUTRAL. You must return the word in valid JSON structure.
                // example:{"sentiment":"string"}
                //  `
                content:`You are an interview grader assistant. Your task is to generate candidate evaluation score.
                Output must be following JSON structure:
                {
                "Confidence":number (1-10 scale),
                "Accuracy":number (1-10 scale),
                "Pass":boolean (true or false),
                } 
                The Response must :
                    1. Include All fields shown above
                    2. Use only the exact field names shown
                    3. Follow the exact data types specified
                    4. Contain only the JSON object and nothing else
                `
                
            },
            {
                role:'user',
                // content:'THE HEADPHONES ARRIVED QUICKLY AND LOOKED GREAT BUT THE LEFT EARCUP STOPPED WORKING AFTER A WEEK'
                content:`Q: What does === do in JavaScript?
                         A: It checks strict equality - both value and type must match.

                         Q: What is Hoisting?
                         A: JavaScript moves the declarations but not the initialization at the top of their scope before the code runs.`
            }
        ]
    })
    console.log(completion.choices[0].message.content);
}
console.log(main());