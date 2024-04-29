'use client';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {produce} from "immer";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';

import Table from "./table";
import Image from "next/image";
import Predict from "./predict";



export default function Home() {
    const { toast } = useToast();
	const [formData, setFormData] = useState([{
        id: 0,
		x: 0,
		y: 0
	}]);

    const [resData,setResData] = useState({});

    const [img,setImg] = useState('');

    function addInput(){
        // setInputList(inputList.concat(<UserInput key={inputList.length} />));
        setFormData(currentInput => [
            ...currentInput,
            {
              id: formData.length,
              x: 0,
              y: 0
            }
          ]);
    }

    const handleFocus = (event) => event.target.select();

    const handleDelete = (deletingField) =>{
        const newList = formData.filter((input) => input !== deletingField);
        setFormData(newList);
    }

    async function Solve() {
        const userInput = {
            'x': formData.map(input => parseFloat(input.x)),
            'y': formData.map(input => parseFloat(input.y))
        };

        console.log(userInput);
        
        const res = await
        fetch("http://127.0.0.1:5555/solve",{
            method: 'POST',
            headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
            },
            body:JSON.stringify(userInput)
        });

        const allPostsData = await res.json();
        setResData(allPostsData);
        if(!allPostsData.error){
            if(allPostsData.status == "Success"){
                Plot();
            }
            else{
                toast({
                    title: allPostsData.status,
                    description: allPostsData.message,
                    variant: "destructive"
                })  
            }
        }
        else{
            toast({
                title: "Error!",
                description: allPostsData.message,
                variant: "destructive"
            })  
        }
	}

    function Plot(){
        axios.get('http://127.0.0.1:5555/plot', {
            headers: {
            'accept': 'image/png',
            },
            responseType: "arraybuffer"
        }).then(function (response) {
            let base64ImageString = Buffer.from(response.data, 'binary').toString('base64');
            let srcURL = "data:image/png;base64, " + base64ImageString;
            setImg(srcURL);
        });
    } 

    const [predictNum, setPredictNum] = useState(0);
    const [predictVal, setPredictVal] = useState();

    const [predictNumOutput, setPredictNumOutput] = useState(0);

    function handlePredictNumChange(e){
        setPredictNum(e.target.value);
    }

    function Predict(){
        axios.get('http://127.0.0.1:5555/predict', {
            params: {
                'val': predictNum
            },
            headers: {
                'accept': 'application/json'
            }
        }).then(function (response) {
            setPredictNumOutput(predictNum);
            setPredictVal(response.data.y);
            Plot();
            
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    
	return (
		<main className='w-3/5 m-auto'>
            <div className='my-8'>
                <h2 className='font-bold text-xl'>Inputs</h2>    
                <div className='flex'>
                    <div className='grid content-around mr-2'>
                        <Label className='mb-4'>x</Label>
                        <Label className='mb-3'>y</Label>
                        <Label className=''></Label>
                    </div>

                    {formData.map((input, ndx) =>{
                        return (
                            <div key={input.id}>
                                <Input className='w-16 mr-2 mb-2 mt-2' onChange={e => {
                                    const xInput = e.target.value;
                                    setFormData(currentInput => produce(currentInput, v =>{v[ndx].x = xInput;}));
                                }} value={input.x} onFocus={handleFocus}/>

                                <Input className='w-16 mr-2 mb-2' onChange={e => {
                                    const yInput = e.target.value;
                                    setFormData(currentInput => produce(currentInput, v =>{v[ndx].y = yInput;}));
                                }} value={input.y} onFocus={handleFocus}/>    

                                {input.id != 0?(<Button name="" className="w-16 mr-2 mb-2" key={input.id} variant="destructive" size="icon" tabIndex="-1" onClick={() => handleDelete(input)}>-</Button>):(null)}
                            </div>
                        )
                    })}

                    <div className='grid content-around'>
                        <Button size="icon" onClick={addInput}>+</Button>
                    </div>
                </div>
                <Button className="my-2 w-full" onClick={Solve}>Interpolate</Button>
            </div>

            {resData.status == "Success" ?(
                <div className="my-8">
                    <div className='my-8'>
                        <h2 className='font-bold text-xl'>Predict</h2>
                        <Label htmlFor="predictNum">Value of a Cubic Spine at x</Label>
                        <div>
                            <Input name="predictNum" type="number" step="any" value={predictNum} onChange={handlePredictNumChange} placeholder="x"/>
                        </div>
                        {predictVal? (<p>value of cubic spine at {predictNumOutput} is <span className='font-medium text-red-600'>{predictVal}</span></p> ):(null)}
                        <Button className="w-full my-2" onClick={Predict}>Predict</Button>
                    </div>

                    <div className='my-8 flex'>
                        <div>
                            <Table resData={resData}/>
                            <div className='my-8'>
                                <h2 className='font-bold text-xl'>Functions</h2>
                                {resData.table.map((numsObj, key) => {
                                    return (
                                        <p className="italic my-1" key={key}>g<sub>{key}</sub>(x) = {numsObj.a}(x-{numsObj.x})<sup>3</sup> + {numsObj.b}(x-{numsObj.x})<sup>2</sup> + {numsObj.c}(x-{numsObj.x}) + {numsObj.d}</p>
                                    )
                                    })}
                            </div>
                        </div>
                        {img ? (<div><h2 className='font-bold text-xl'>Plotted Graph</h2><Image height={500} width={500} src={img} alt="nothing"/></div>):(null)}
                    </div>
                </div>
            ):(null)}

            
            
		</main>
	);
}
