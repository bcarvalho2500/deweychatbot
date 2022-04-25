import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import  { useAuth0 } from '@auth0/auth0-react'
import { Helmet } from "react-helmet"
import NavigationBar from "../NavigationBar/NavigationBar"
import { Container, Row, Col, Stack, Button, Form,} from 'react-bootstrap';
import './ManualHandling.css'
import 'react-toastify/dist/ReactToastify.css'
import { Select } from 'react-select';
import ManualHandlingItem from './ManualHandlingItem';
import label from '../../assets/react.png';
import Modal from "react-bootstrap/Modal";




toast.configure()

export default function ManualHandling(){
    
    const { isLoading, loginWithRedirect, isAuthenticated } = useAuth0();
    const [ unhandledItems, setUnhandledItems ] = useState([])
    const [ fileName, setFileName ] = useState("Upload JSON File")

    const[dropList, setDropList] =useState([]);

    useEffect(() => {
        (async function login() {
            if (!isLoading && !isAuthenticated) {
                await loginWithRedirect({
                    appState:{
                        returnTo: window.location.pathname
                    }
                });
            }
        })();
    }, []);


    useEffect(() => {
        const url = "/api/unprocessed";
    
        const fetchData = () => {
            fetch(url, {
              method: "GET",
              dataType: "JSON",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              }
            })
            .then((resp) => {
              return resp.json()
            })
            .then((data) => {
              let tmpArray = []
              for(var i = 0; i < data.length; i++){
                  tmpArray.push(data[i].message)
              }
              //console.log("Tmp array:" + tmpArray)
              setUnhandledItems(tmpArray)
            })
            .catch((error) => {
              console.log(error, "There was an error!")
            })
        }
        fetchData();
    }, []);
    
    
	
    useEffect(() => {
		const url = "/api/intent/all";
        const fetchData = () => {
			fetch(url, {
				method: "GET",
				dataType: "JSON",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				}
            })
            .then((resp) => {
				return resp.json()
            })
            .then((data) => {
				let tArray = []
				for(var i = 0; i < data.length; i++){
					tArray.push(data[i])
				}
				//console.log("tArray:" + tArray)
				setDropList(tArray)
            })
            .catch((error) => {
				console.log(error, "There was an error!")
            })
        }
        fetchData();
    }, []);
	
	const handleSubmit = () => {
		
		fetch("/api/trainModel", {
			method: "GET",
			dataType: "JSON",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
		})
		.then((resp) => {
			return resp.json()
		})
		.then((data) => {
			if(process.env.REACT_APP_TOAST_TRAINMODEL){
				toast.success(data.message)
			}
		})
		
	}

    const handleSave = (savedIntents) => {
        
        fetch("/api/data/training/add", {
            method: "POST",
            dataType: "JSON",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(savedIntents)
        })
        .then((resp) => {
            return resp.json()
        })
        .then((data) => {
            if(process.env.REACT_APP_TOAST_ADDINTENT){
                toast.success(data.message)
            }
        })
		.catch((error) => {
			console.log(error, "There was an error!")
		})
    }

	const handleBulkSave = (savedIntents) => {
        
        fetch("/api/data/training/add", {
            method: "POST",
            dataType: "JSON",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: savedIntents
        })
        .then((resp) => {
            return resp.json()
        })
        .then((data) => {
            if(process.env.REACT_APP_TOAST_ADDINTENT){
                toast.success(data.message)
            }
        })
		.catch((error) => {
			console.log(error, "There was an error!")
		})
    }
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
		const fileReader = new FileReader()
		fileReader.readAsText(file.target.files[0], 'UTF-8')
		fileReader.onload = file => {
			setFile(file.target.result);
		}
		setFileName(file.target.files[0].name)
  	}
      const [isOpen, setIsOpen] = React.useState(false);

      const showModal = () => {
        setIsOpen(true);
      };
    
      const hideModal = () => {
        setIsOpen(false);
      };

    return( 
        <div>
            <Helmet>
                <title>Manual Handling | Dewey ChatBot</title>
            </Helmet>
            <NavigationBar />
           
            <Container fluid={true} className="bgcolorHandling" style={{height: "100vh"}}>
                <Row className="row align-items-center">
                    <h1 className="text-center" style={{ fontSize: "3.2rem", fontFamily: "Roboto Mono, monospace", color: "white", paddingBottom:"25px" }}>Manual Intent Handling</h1>
                </Row>
                
            <Row className="justify-content-center">
				<ManualHandlingItem data={ unhandledItems } onTrainModelClick={ handleSubmit } onSaveDataClick={ handleSave } dropdownData={ dropList }/>
            </Row>
            <br />
            <div className="center">
            <Row className=" row justify-content-center w-50">
           
            <div className="upload">
            <Stack direction="horizontal" gap={3} style={{display: 'flex', justifyContent: 'center', width:"100%", paddingBottom:"6px"}} className="col-md-3 mx-auto mt-2">
            <input onChange={handleChange} type="file" name="file" id="file" class="inputfile" accept="application/JSON"/>
            <label for="file"> { fileName }</label>
            <div className = "vr" />
            <Button variant="dark" onClick={showModal} disabled={file == null} >Submit JSON File</Button>
      <Modal centered size="lg"
      aria-labelledby="contained-modal-title-vcenter"
       show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title>Submitting JSON File</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit {fileName} ?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={hideModal}>Cancel</Button>
          <Button onClick={ () => {handleBulkSave(file); hideModal();} } >Submit</Button>
        </Modal.Footer>
      </Modal>
                </Stack>
                </div>
                </Row>
                </div>
         </Container>
        </div>
        
  );
}