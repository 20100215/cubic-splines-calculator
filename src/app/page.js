'use client';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Table from "./table";

import axios from 'axios';
import Image from "next/image";

import Predict from "./predict";

import { useToast } from "@/components/ui/use-toast";

export default function Home() {
    const { toast } = useToast();
	const [formData, setFormData] = useState({
		x: [],
		y: []
	});

    const [data,setData] = useState({});
    const [img,setImg] = useState('');

    const handleChange = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value.split(",").map(d => Number(d));

        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }

    async function Solve() {
        const userInput = {
            'x': formData.x,
            'y': formData.y
        };
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
        setData(allPostsData);

        if(!allPostsData.error){
            Plot();
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

	return (
		<main className='w-3/5 m-auto'>
            <div className='my-4'>
                <h2>Inputs</h2>    
                <div>
                    <Label htmlFor="x">x</Label>
                    <Input id="x" name="x" onChange={handleChange} placeholder="separate each value with a comma(',')"/>
                </div>
                <div>
                    <Label htmlFor="y">y</Label>
                    <Input id="y" name="y" onChange={handleChange} placeholder="separate each value with a comma(',')"/>
                </div>
                <Button className="my-2 w-full" onClick={Solve}>Interpolate</Button>
            </div>
            <div className='my-4 flex'>
                <Table data={data}/>
                {img ? (<div><h2>Plotted Graph</h2><Image height={500} width={500} src={img} alt="nothing"/></div>):(null)}
            </div>
            <Predict />
		</main>
	);
}
