import express from "express"
import cors from "cors"
import * as tf from "@tensorflow/tfjs-node";
import path from "path"
import { Tokenizer } from "./tokenizer";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors())

app.get('/', (req, res) => {
    let text = decodeURI(req.query['text'].toString());
    res.json(JSON.stringify({
        tokenized: tokenizer.tokenize(text)
    }));
});

app.use(express.static(path.join(__dirname, 'react-build')));
app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname, 'react-build', 'index.html'));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

let tokenizer: Tokenizer;
loadModel();
async function loadModel(){
    let model = await tf.loadLayersModel('file://model_js/model.json');
    tokenizer = new Tokenizer(model);
    console.log('Model Loaded');
}