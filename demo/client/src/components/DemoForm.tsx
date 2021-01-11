import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export interface Props{
    setResultText?: (str: string) => void;
    setLoading?: (loading: boolean) => void;
}

export interface States{
    inputText: string
}

export class DemoForm extends React.Component<Props,States> {

    constructor(props: Props){
        super(props);
        this.state = {
            inputText: ""
        };
        this.updateInputText = this.updateInputText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e: React.FormEvent<HTMLElement>): void{
        e.preventDefault();
        let setText = this.props.setResultText ?? (_ => {});
        let setLoading = this.props.setLoading ?? (_ => {});
        setLoading(true);
        fetch('https://thaicutter-server.herokuapp.com/?' + new URLSearchParams({text: this.state.inputText}))
        .then(async res => {
            let reply = await res.json();
            let temp = '';
            for(let k in reply){
                temp += reply[k];
            }
            let result = JSON.parse(temp);
            setText(result['tokenized'].join('|'));
            setLoading(false);
        });
    }

    updateInputText(e: React.ChangeEvent<HTMLInputElement>){
        e.persist();
        this.setState((state) => ({
            inputText: e.target.value
        }));
    }

    render(){
        return (
        <div style={{paddingTop: "10vh"}}>        
            <Form onSubmit={this.onSubmit}>
                <Form.Label>Input Text</Form.Label>
                <Form.Control type="text" placeholder="Write Text Here" onChange={this.updateInputText}></Form.Control>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </div>);
    }

}

export default DemoForm;
