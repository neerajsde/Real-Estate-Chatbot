import { llmCall } from '../config/genai.js';
import resSender from "../utils/resSender.js";

export async function chatWithClient(req, res) {
    try{
        const { userQuery, chatsHistory=[] } = req.body;
        if(!userQuery){
            return resSender(res, 401, false, 'Write a message Please');
        }
        chatsHistory.push({ role: 'user', parts: [{ text: userQuery }] })
        const response = await llmCall(chatsHistory);

        return resSender(res, 200, true, 'Gen AI Response', response);
    } catch (err) {
        console.error("Error while chatting with bot ai:", err.message);
        return resSender(res, 500, false, "Internal server error", err.message);
    }
}