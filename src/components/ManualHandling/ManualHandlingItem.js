import { useState, useEffect }from "react";
import { Container, Row, Col, Stack, Button, Form} from 'react-bootstrap';
import * as React from "react";
import Creatable from 'react-select/creatable';

export default function ManualHandlingItem(props){
    // Props that this function takes are the messages
    const [unhandledItems, setUnhandledItems] = useState([])
    const dropList = props.dropdownData
    const [intent, setIntent] = useState('')
    
    const [listOfIntents, setListOfIntents]  = useState([]); 
    
   useEffect(() => {
       const tempArray =[];
        dropList?.forEach(element => {
            tempArray.push(
                {label: element, value: element
            })
    });
    setListOfIntents(tempArray);
   },[dropList])
   
   
   useEffect(() => {
        setUnhandledItems([...props.data])
    },[props.data])
    
   const handleDelete = (message) => {
        const tmp = unhandledItems
        const index = tmp.indexOf(message)
        tmp.splice(index, 1)
        setUnhandledItems([...tmp])
   }

   const handleAddData = (intent) => {
        const tmpList = listOfIntents
        var exists = false
        for(var i = 0; i < tmpList.length; i++){
            if(tmpList[i].value === intent){
                exists = true
            }
        }
        if(!exists){
            const tmpObj = {label: intent, value: intent}
            tmpList.push(tmpObj)
            setListOfIntents(tmpList)
        }
   }
      
    return (
        <>
        <div className="mainbox">
        <div className ="box">
            { unhandledItems.map((unhandledItem) => (
                    <div className="border border-0 w-100 p-3">
                    <h4 className="text-center" style={{fontFamily: "Roboto Mono, monospace", color: "white" }}>{ unhandledItem }</h4>
                        <Stack direction="horizontal" gap={3} style={{ display: 'flex', justifyContent: 'center' }}>

                        <Creatable  className="w-75" placeholder="Select an Intent..." options={listOfIntents} onChange={(opt, meta) => setIntent(opt.value)}/>
                                {/*<Form.Control className="w-75" placeholder="Enter your intent here..." onInput={ e => setIntent(e.target.value)}/>*/}
                                <div className="vr" />
                                <Button variant="dark" className="align-items-center" onClick={() => {
                                    const arrayPatterns = new Array()
                                    arrayPatterns.push(unhandledItem)
                                    handleDelete(unhandledItem)
                                    handleAddData(intent)
                                    props.onSaveDataClick([{ "patterns": arrayPatterns, "tag": intent}])
                                }}>Save</Button>
                        </Stack>
                <br />
                </div>
            ))}
            </div>
            </div>
            <br/>
            <br/>
            <div>
                <Stack direction="horizontal" gap={3} style={{ display: 'flex', justifyContent: 'center' }} className="col-md-3 mx-auto mt-4">
                    <Button variant="dark" onClick={() => {
                        props.onTrainModelClick()
                    }}>Train Model</Button>
                </Stack>

            </div>
        </>
    )
}