import React from 'react';
import Image from 'react-bootstrap/Image';
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import loadingCircular from './loading_spinner.gif';

export interface Props{}

export interface States{}

export class LoadingPane extends React.Component<Props,States>{

    render(){
        return (
            <div style={{paddingTop: "10vh"}}>
                <Jumbotron>
                    <Container>
                        <h3 style={{color: 'black'}}>Generating Results... Please wait</h3>
                        <Image src={loadingCircular}></Image>
                    </Container>
                </Jumbotron>
            </div>
        );
    }

}

export default LoadingPane;
