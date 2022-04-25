import React, {useState, useEffect} from 'react';
import Helmet from "react-helmet";
import NavigationBar from '../NavigationBar/NavigationBar';
import { Container, Row, Col, Button, InputGroup, FormControl, Modal} from 'react-bootstrap';
import * as ReactBootStrap from 'react-bootstrap'
import './UIDebug.css';
import image from '../../assets/team.png';
import avatar from '../../assets/avatar.png';
import dewey from "../../assets/dewey.png";


export default function UIDebug(){
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [Items, setItems ] = useState({intent: "",
                                        score: "",
                                        classifications: [],
                                        response: ""
                                        })
  const [userMessage,setUserMessage] = useState('');
  const [loading , setLoading] = useState(true);


    async function fetchData(){
        setLoading(true)
        const response = await fetch("/api/client/message", {
            method: "POST",
            dataType: "JSON",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ message: userMessage })
          })
        
          const results = await response.json()
          const tempobject = {
            intent: results.intent,
            score: results.score,
            classifications: results.classifications,
            response: results.response
        } 
            if(tempobject.classifications){
                tempobject.classifications.sort((a,b) => {
                    if(a.score > b.score){
                        return -1
                    }else{
                        return 1
                    }
                })
            }
          setItems(tempobject)
          console.log(tempobject)
          setLoading(false)
    };

    const [input, setInput] = useState();

    return(
        
        <div>
            <Helmet>
                <title>UI Debug | Dewey ChatBot</title>
            </Helmet>
            <NavigationBar />
            <Container fluid={true} className="bgcolorDebug" style={{height: "100vh"}}>
                        <Row className="row align-items-center" xs={1} md={1} lg={2} xl={2}>
                            <Col>
                                <div className="align">
                                    <h1 className="text-center" style={{ fontSize: "3.2rem", fontFamily: "Roboto Mono, monospace", color: "white" }}>Dewey Debugger</h1>
                                    <p className="text-center" style={{ fontSize: "2.1rem", fontFamily: "Roboto Mono, monospace", color: "white" }}>Identify, analyze, and fix errors</p>
                                    <div className="text-center">
                                    <InputGroup className="mb-3" style={{width: '100%'}}>
                                     <FormControl type="text" onChange = { e => setInput(e.target.value)}
                                        placeholder="Type a message..." onInput = { e => setUserMessage(e.target.value)}/>
                                        <Button disabled = {!input} onClick = { () => {
                                            setShow(true); fetchData(); } 
                                        }
                                    
                                    variant="dark" id="button-addon2">
                                        Send
                                        </Button>
                                        <Modal size="md"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                            
                                        <Modal.Title>Dewey ChatBot</Modal.Title>

                                        </Modal.Header>
                                        
                                        <Modal.Body>
                                        
                                        <div className="card">
                                        <div className="card-body">
                                        <img
                                    src={dewey}
                                    className="dewey"
                                    alt="dewey Logo" />
                                           Hi, How Can I Help You ?
                                        </div>
                                        </div>
                                        
                                        </Modal.Body>
                                        <Modal.Body>
                                        <div className="card">
                                        <div className="card-body">
                                        <img
                                    src={avatar}
                                    className="avatar"
                                    alt="avatar Logo" />
                                            {userMessage}
                                        </div>
                                        </div>
                                    </Modal.Body>

                                        <Modal.Body>
                                        <div className="card">
                                        <div className="card-body">
                                        <img
                                    src={dewey}
                                    className="dewey"
                                    alt="dewey Logo" />
                                             {Items.response}
                                        </div>
                                        </div>
                                        
                                        </Modal.Body>
                                        <div className="details">Details</div>
                                       
                                        <Modal.Body>
                                        <div className="card overflow-hidden">
                                        <div className="card-body">
                                           <b> Intent: </b> 
                                           <p style={{display:'inline', color:'green'}}> ' {loading ? <ReactBootStrap.Spinner animation ="border"/> :Items.intent} ' </p>
                                    <br/>
                                            <b>Accuracy Score: </b> 
                                            <p style={{color:'red', display:'inline'}}> ' {loading ? <ReactBootStrap.Spinner animation ="border"/>: (Items.score * 100).toFixed(2)}% ' </p> 
                                            <br />
                                            <br />
                                            {
                                                <>
                                                    <b>Classifications: </b>
                                                    <br/> 
                                                    {loading ? <ReactBootStrap.Spinner animation ="border"/>: Items.classifications.map((item) => {
                                                        return <> 

                                                           <span style={{display:'inline-block' ,width:'75px'}}></span> [ Intent: <p style={{color:'green', display:'inline'}}> ' {item.intent } ' </p><p style={{color:'black', display:'inline'}}>  ,  </p> Score: <p style={{color:'red', display:'inline'}}> ' { (item.score * 100).toFixed(2) }% '</p> ]
                                                            <br />
                                                        </>
                                                    })}
                                                </>
                                            }
                                        </div>
                                        </div>
                                        
                                        </Modal.Body>
                                    </Modal>
                                    </InputGroup>
                                    </div>
                                </div>
                            </Col>
                            <Col className="">
                                <img
                                    src={image}
                                    className="img-fluid"
                                    alt="Homepage Logo" />
                            </Col>
                        </Row>
                    </Container>
        </div>
    )
}
