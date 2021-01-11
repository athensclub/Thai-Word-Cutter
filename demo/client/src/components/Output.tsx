import React from 'react';
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

export interface Props{
    text: string
}

export interface States{}

export class Output extends React.Component<Props,States>{

    render(){
        return (
            <div style={{paddingTop: "10vh"}}>
                <Jumbotron>
                    <Container>
                        <p style={{color: 'black'}}>{this.props.text}</p>
                    </Container>
                </Jumbotron>
            </div>
        );
    }

}

export default Output;
