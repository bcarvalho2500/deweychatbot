import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import NavigationBar from "../NavigationBar/NavigationBar";
import './TrainingData.css';
import { Helmet } from "react-helmet"
import { Row, Col, Stack} from 'react-bootstrap';
import  { useAuth0 } from '@auth0/auth0-react'
import Creatable from 'react-select/creatable';

toast.configure()
export default function TrainingData(){
	
	const { isLoading, loginWithRedirect, isAuthenticated } = useAuth0();
	const [trainingData, setTrainingData] = useState([])
	const [DropList, setDropList] = useState([])

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
		const url = "/api/data/training";
	
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
				const tmpData = new Array()
				data?.forEach(element => {
					const tmpObj = {
						tag: element.tag,
						patterns: element.patterns
					}
					tmpData.push(tmpObj)
				});
				setTrainingData(tmpData)
			})
			.catch((error) => {
				console.log(error, "There was an error!")
			})
		}
		fetchData();
	}, []);

	const onDeleteClick = (obj) => {
		const url = "/api/data/training/delete"
		fetch(url, {
			method: "POST",
			dataType: "JSON",
			headers: {
				"Content-Type": "application/JSON; charset=utf-8",
			},
			body: JSON.stringify(obj)
		})
		.then((resp) => {
			return resp.json()
		})
		.then((data) => {
			const tmp = trainingData
			const newData = new Array()
			for(var i = 0; i < tmp.length; i++){
				if(tmp[i].tag === obj.tag){
					const tmpPatterns = tmp[i].patterns
					const index = tmpPatterns.indexOf(obj.patterns)
					tmpPatterns.splice(index, 1)
					const tmpData = {tag: obj.tag, patterns: [...tmpPatterns]}
					newData.push(tmpData)
				}else{
					newData.push(tmp[i])
				}
			}
			setTrainingData([...newData])
			if(process.env.REACT_APP_TOAST_DELETEINTENT){
				toast.success(data.message)
			}
		})
		.catch((error) => {
			console.log(error, "There was an error")
		})
	}

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

	const [listOfIntents, setListOfIntents]  = useState([]); 
    
   useEffect(() => {
       const tempArray =[{label:'All Intents', value: 'All Intents'}];
        DropList?.forEach(element => {
            tempArray.push(
                {label: element, value: element
            })
    });
    setListOfIntents(tempArray);
   },[DropList])
	
   const [Search, setSearch] = useState('All Intents');
	
	return(
		<> 
		<Helmet>
		<title>Training Data | Dewey ChatBot</title>
		</Helmet>
			<NavigationBar />
			<Container fluid={ true } className="bgcolorTraining" style={{height: "100vh"}}>
			<Row className="row align-items-center">
                    <h1 className="text-center" style={{ fontSize: "3.2rem", fontFamily: "Roboto Mono, monospace", color: "white", paddingBottom:"25px" }}>Training Data Handling</h1>
                </Row>
				<div className="boxdata">
				{
					trainingData.filter((element) => {
						if(Search === 'All Intents')
						return element
						else if (element.tag === Search)
							return Search
					
				}).map((element) => {

						return(
							<>
							<br/>
								<div style={{color: 'white', fontSize: '2rem'}}>
									<b style={{color:'black',fontFamily: "Roboto Mono, monospace"}}>Intent: </b> ' { element.tag } '
									</div>
									<br/>
								{
									element.patterns.map((pattern) => {
										
										return(
											<>
									  
											 <Stack direction="horizontal" gap={3} style={{ display: 'flex'}}>
												<div style={{color: 'white', fontSize:'1.75rem', paddingBottom:'5px'}}>
												<i style={{color:'black',fontFamily: "Roboto Mono, monospace", marignLeft:"75px"}}>Pattern: </i> { pattern }
													</div>
								
													<div className="vr" />
												<Button variant="danger"
													size="sm"
													onClick={() => {
														onDeleteClick({tag: element.tag, patterns: pattern})
													}}
												>Delete</Button>
												 </Stack>
	
										
											</>
											
										)
									})
								}
							</>
						)
					})
				}
				</div>
				<br/>
                <div style={{display:'flex', justifyContent:'center', paddingTop:'7px'}}>
                <strong style={{color:'black', marginRight:'10px', marginTop:'6.25px', fontSize:'1rem'}}> Filter By: </strong> <Creatable className="w-50" defaultValue ={{value:'All Intents', label:'All Intents'}} onChange={(event) => {setSearch(event.value)}}  options={listOfIntents} isValidNewOption={() => false}/>
                </div>
			</Container>
		</>
	)
}