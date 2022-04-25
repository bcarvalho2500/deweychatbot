import React from 'react';
import './Homepage.css';
import {Helmet} from "react-helmet";
import NavigationBar from "../NavigationBar/NavigationBar";
import { Container, Row, Col, Button, Card} from 'react-bootstrap';
import image from '../../assets/image.png';
import tensorflow from '../../assets/tensorflow.png';
import react from '../../assets/react.png';
import mongodb from '../../assets/mongodb.png';
import heroku from '../../assets/heroku.png';
import nodejs from '../../assets/nodejs.png';
import postman from '../../assets/postman.png';

export default function Homepage(){
    return(
        <div>
        <Helmet>
            <title>Home | Dewey ChatBot</title>
        </Helmet>
                <NavigationBar /><Container className="bgcolorHomepage" fluid={true} style={{height:"89vh"}}>
                        <Row className="row align-items-center" xs={1} md={1} lg={2} xl={2}>
                            <Col>
                                <div className="align">
                                    <h1 className="text-center" style={{ fontSize: "3.2rem", fontFamily: "Roboto Mono, monospace", color: "white" }}>Hi,I'm Dewey!</h1>
                                    <p className="text-center" style={{ fontSize: "2.2rem", fontFamily: "Roboto Mono, monospace", color: "white" }}>Your Conversational Chatbot</p>
                                    <div className="text-center">
                                        <Button href="#learnmore" variant="dark">Learn More</Button>
                                    </div>
                                </div>
                            </Col>
                            <Col className="Col align-items-center">
                                <img
                                    src={image}
                                    style={{width: "100%"}}
                                    alt="Homepage Logo" />
                            </Col>
                        </Row>
                    </Container>
                    <Container fluid={true} style={{height: "100vh"}}>
                            <div id="learnmore">
                                <Row className="justify-content-md-center">
                                <h1 id="about" >About Dewey</h1>
                                
                            
  </Row>
  <Row className="justify-content-md-center">
    <Col md lg="4">
    <Card className="align-items-center" style={{margin:"20px"}}>
    <Card.Img variant="top" src={tensorflow} style={{width:"80px",margin:"25px"}} />
    <Card.Body>
      <Card.Title>TensorFlow</Card.Title>
      <Card.Text>
        Used to train the NLP model, TensorFlowJS allowed us to create a custom solution for our NLP as well as 
        easily integrate our NLP with our express server.
      </Card.Text>
    </Card.Body>
  </Card>
    </Col>
    <Col  md lg="4"> <Card className="align-items-center" style={{margin:"20px"}}>
    <Card.Img variant="top" src={react} style={{width:"80px",margin:"25px"}} />
    <Card.Body>
      <Card.Title>React</Card.Title>
      <Card.Text>
        With an original site that had alot of copy and pasted code, React allowed us to easily reuse components. Was paired with bootstrap 
        to create a responsive site.
      </Card.Text>
    </Card.Body>
  </Card>
  </Col>
    <Col md lg="4">
    <Card className="align-items-center" style={{margin:"20px"}}>
    <Card.Img variant="top" src={mongodb} style={{width:"80px",margin:"25px"}} />
    <Card.Body>
      <Card.Title>MongoDB</Card.Title>
      <Card.Text>
        Used to store our training and unprocessed data, MongoDB integrates well with in express thanks to the mongoose package found in NPM.
      </Card.Text>
    </Card.Body>
  </Card>
    </Col>
  </Row>


  <Row className="justify-content-md-center">
    <Col md lg="4">
    <Card className="align-items-center" style={{margin:"20px"}}>
    <Card.Img variant="top" src={heroku} style={{width:"80px",margin:"25px"}} />
    <Card.Body>
      <Card.Title>Heroku</Card.Title>
      <Card.Text>
        Used to host our site. Allows hosting of multiple frameworks such as React and NodeJS.
      </Card.Text>
    </Card.Body>
  </Card>
    </Col>
    <Col  md lg="4"> <Card className="align-items-center" style={{margin:"20px"}}>
    <Card.Img variant="top" src={[postman]} style={{width:"80px",margin:"25px"}} />
    <Card.Body>
      <Card.Title>Postman</Card.Title>
      <Card.Text>
        Used to test our API calls. Provides an easy interface and workspaces can be shared with teams.
      </Card.Text>
    </Card.Body>
  </Card>
  </Col>
    <Col md lg="4">
    <Card className="align-items-center" style={{margin:"20px"}}>
    <Card.Img variant="top" src={nodejs} style={{width:"80px",margin:"25px"}} />
    <Card.Body>
      <Card.Title>Node JS</Card.Title>
      <Card.Text>
        Used to build our backend. A few of the notable packages used include Express and Mongoose.
      </Card.Text>
    </Card.Body>
  </Card>
    </Col>
  </Row>
</div>         
    </Container>
</div>  
    )
}