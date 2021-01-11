import * as tf from "@tensorflow/tfjs-node";

const characters =  'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙abcdefghijklmnopqrstuvwxyz"\'0123456789,.!?/\\:;%()[]{}+_-*@#><=^$& \t\n';
const charEncode = new Map<string, number>();
const charDecode = new Map<number, string>();
for(let i = 0;i < characters.length;i++){
    let c = characters.charAt(i);
    charEncode.set(c,i+1);
    charDecode.set(i+1,c);
}

function encode(data: string): number[]{
    let encoded = [];
    data = data.toLowerCase();
    for(let i = 0;i < data.length;i++){
        let c = data.charAt(i);
        let encode: number = charEncode.get(c) ?? 0;
        encoded.push(encode);
    }
    return encoded;
}

function decode(data: number[]): string{
    let decoded = '';
    for(let i = 0;i < data.length;i++){
        if(data[i] !== 0){
            decoded +=  charDecode.get(data[i]);
        }
    }
    return decoded;
}

function splitTextData(encoded: number[]): number[][]{
    let splitted = [], chunk = [],temp = [];
    for(let i = 0;i < encoded.length;i++){
        let c = encoded[i];
        temp.push(c);
        if(c === charEncode.get(' ')){
            if(temp.length > 0){
                if(temp.length + chunk.length < 256){
                    chunk.push(...temp);
                    temp = [];
                }else{
                    splitted.push(chunk);
                    chunk = [];
                    chunk.push(...temp);
                    temp = [];
                }
            }
        }
    }
    if(temp.length > 0){
        if(temp.length + chunk.length < 256){
            chunk.push(...temp);
            temp = []
        }else{
            splitted.push(chunk);
            chunk.push(...temp);
        }
    }
    if(chunk.length > 0){
        splitted.push(chunk);
    }
    return splitted;
}

function padSequences(d: number[]): tf.Tensor{
    let data = [...d];
    while(data.length < 256){
        data.unshift(0);
    }
    return tf.tensor([data]);
}

export class Tokenizer{

    private model: tf.LayersModel;

    constructor(model: tf.LayersModel){
        this.model = model;
    }

    tokenize(text: string): string[] {
        let tokenized: string[] = [];
        let splitted = splitTextData(encode(text));
        for(let chunk of splitted){
            let temp: number[] = [], before: number[] = [], after: number[] = [...chunk];
            for(let c of chunk){
                temp.push(c);
                after.shift();
                let beforeTensor = padSequences(before);
                let currentTensor = padSequences(temp);
                let afterTensor = padSequences(after);
                let prediction = this.model.predict([beforeTensor,currentTensor,afterTensor]);
                if(prediction instanceof Array){
                    for(let i = 1;i < prediction.length;i++){
                        prediction[i].dispose();
                        console.log('get more than 1 tensor from model.predict in tokenize()');
                    }
                    prediction = prediction[0];
                }
                let pred = prediction.dataSync()[0];
                if(pred > 0.5){
                    tokenized.push(decode(temp));
                    before.push(...temp);
                    temp = [];
                }
                prediction.dispose();
                beforeTensor.dispose();
                currentTensor.dispose();
                afterTensor.dispose();
            }
            if(temp.length > 0){
                tokenized.push(decode(temp));
            }
        }
        return tokenized;
    }

}