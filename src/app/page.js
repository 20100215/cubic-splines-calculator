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
5.634
	return (
		<main className='w-3/5 m-auto'>
            <div className='my-4'>
                <h2>Inputs</h2>    
                <div className='flex mb-12'>
                    <div className='grid content-around mr-2'>
                        <Label className='mb-3'>x</Label>
                        <Label className='mb-3'>y</Label>
                        <Label className='mb-3'></Label>
                    </div>

                    {formData.map((input, ndx) =>{
                        return (
                            <div key={input.id}>
                                <Input className='w-16 mr-2 mb-2' onChange={e => {
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
                <div className="">
                    <div className='my-4 flex'>
                        <Table resData={resData}/>
                        {img ? (<div><h2>Plotted Graph</h2><Image height={500} width={500} src={img} alt="nothing"/></div>):(null)}
                    </div>
                    <Predict />
                </div>
            ):(null)}

            
            
		</main>
	);
}
