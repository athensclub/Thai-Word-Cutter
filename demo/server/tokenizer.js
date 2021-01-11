"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
var tf = __importStar(require("@tensorflow/tfjs-node"));
var characters = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙abcdefghijklmnopqrstuvwxyz"\'0123456789,.!?/\\:;%()[]{}+_-*@#><=^$& \t\n';
var charEncode = new Map();
var charDecode = new Map();
for (var i = 0; i < characters.length; i++) {
    var c = characters.charAt(i);
    charEncode.set(c, i + 1);
    charDecode.set(i + 1, c);
}
function encode(data) {
    var _a;
    var encoded = [];
    data = data.toLowerCase();
    for (var i = 0; i < data.length; i++) {
        var c = data.charAt(i);
        var encode_1 = (_a = charEncode.get(c)) !== null && _a !== void 0 ? _a : 0;
        encoded.push(encode_1);
    }
    return encoded;
}
function decode(data) {
    var decoded = '';
    for (var i = 0; i < data.length; i++) {
        if (data[i] !== 0) {
            decoded += charDecode.get(data[i]);
        }
    }
    return decoded;
}
function splitTextData(encoded) {
    var splitted = [], chunk = [], temp = [];
    for (var i = 0; i < encoded.length; i++) {
        var c = encoded[i];
        temp.push(c);
        if (c === charEncode.get(' ')) {
            if (temp.length > 0) {
                if (temp.length + chunk.length < 256) {
                    chunk.push.apply(chunk, temp);
                    temp = [];
                }
                else {
                    splitted.push(chunk);
                    chunk = [];
                    chunk.push.apply(chunk, temp);
                    temp = [];
                }
            }
        }
    }
    if (temp.length > 0) {
        if (temp.length + chunk.length < 256) {
            chunk.push.apply(chunk, temp);
            temp = [];
        }
        else {
            splitted.push(chunk);
            chunk.push.apply(chunk, temp);
        }
    }
    if (chunk.length > 0) {
        splitted.push(chunk);
    }
    return splitted;
}
function padSequences(d) {
    var data = __spreadArrays(d);
    while (data.length < 256) {
        data.unshift(0);
    }
    return tf.tensor([data]);
}
var Tokenizer = /** @class */ (function () {
    function Tokenizer(model) {
        this.model = model;
    }
    Tokenizer.prototype.tokenize = function (text) {
        var tokenized = [];
        var splitted = splitTextData(encode(text));
        for (var _i = 0, splitted_1 = splitted; _i < splitted_1.length; _i++) {
            var chunk = splitted_1[_i];
            var temp = [], before = [], after = __spreadArrays(chunk);
            for (var _a = 0, chunk_1 = chunk; _a < chunk_1.length; _a++) {
                var c = chunk_1[_a];
                temp.push(c);
                after.shift();
                var beforeTensor = padSequences(before);
                var currentTensor = padSequences(temp);
                var afterTensor = padSequences(after);
                var prediction = this.model.predict([beforeTensor, currentTensor, afterTensor]);
                if (prediction instanceof Array) {
                    for (var i = 1; i < prediction.length; i++) {
                        prediction[i].dispose();
                        console.log('get more than 1 tensor from model.predict in tokenize()');
                    }
                    prediction = prediction[0];
                }
                var pred = prediction.dataSync()[0];
                if (pred > 0.5) {
                    tokenized.push(decode(temp));
                    before.push.apply(before, temp);
                    temp = [];
                }
                prediction.dispose();
                beforeTensor.dispose();
                currentTensor.dispose();
                afterTensor.dispose();
            }
            if (temp.length > 0) {
                tokenized.push(decode(temp));
            }
        }
        return tokenized;
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
