import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message) : void;
    protected client: Stan; // protected means sub classes can access
    protected ackWait = 5*1000;

    constructor(client: Stan) {
        this.client = client
    }

    subscriptionOptions(){
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true) //require confirmation message is recieved, otherwise sent over and over.
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject, 
            this.queueGroupName, 
            this.subscriptionOptions());
        
        subscription.on('message', (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

            const parseData = this.parseMessage(msg);
            this.onMessage(parseData, msg);
        })
    }

    parseMessage(msg: Message){
        const data = msg.getData();
        return typeof data === 'string' 
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}
