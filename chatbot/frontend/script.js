const input = document.querySelector('#input');
const chatContainer = document.querySelector('#chat-container');
const askBtn = document.querySelector('#ask')
console.log(input);
input.addEventListener('keyup',handleEnter);
askBtn.addEventListener('click',handleAsk);
async function generate(text){
    //append msg to ui
    const msg = document.createElement("div");
    msg.className=`my-6 bg-neutral-600 p-3 rounded-xl ml-auto max-w-fit`
    msg.textContent=text;
    chatContainer?.appendChild(msg);
    input.value=''
    // send it to llm
    const assistantMessage = await callServer(text);
    console.log(assistantMessage);
    //apend assistant msg to ui
    const assistantMsg = document.createElement("div");
    assistantMsg.className=`my-6 bg-neutral-800 p-3 rounded-xl mr-auto max-w-fit`
    assistantMsg.textContent=assistantMessage;
    chatContainer?.appendChild(assistantMsg);
}
async function callServer(inputText) {
    const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputText })
    });

    if (!response.ok) {
        throw new Error('Error generating response');
    }

    const result = await response.json();
    console.log("Server result:", result);
    return result.message;  // THIS is assistantMessage
}
async function handleAsk(e){
         const text = input.value.trim();
        if(!text) return;
        await generate(text);

}
async function handleEnter(e){
    if(e.key==='Enter'){
        const text = input.value.trim();
        if(!text) return;
        await generate(text);
        console.log(text);
    }
}