/// <reference path="jquery/jquery.d.ts" />

interface HtmlHelper {
    loadCss(url: string): JQueryPromise;
}

interface ISocketMessage {
    from: string;
    when: Date;
    text: string;
}

interface ISocketClient {
    username: string;
    channel: string;

    init(room: string, name: string): JQueryPromise;
    sendMessage(message: ISocketMessage);
    getUsersInRoom();
}