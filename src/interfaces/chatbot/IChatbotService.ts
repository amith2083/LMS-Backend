// export interface IChatService {
//   handleMessage(message: string): Promise<string>;
// }


export interface IChatbotService {

  generateAnswer(query: string): Promise<string>

}