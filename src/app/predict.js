import React from 'react'
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';
function Prediction() {

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
            
        })
            .catch(function (error) {
            console.log(error);
        });
    }

  return (
    <div className='my-4'>
        <h2>Predict</h2>
        <Label htmlFor="predictNum">Value of a Cubic Spine at x</Label>
        <div>
            <Input name="predictNum" type="number" step="any" value={predictNum} onChange={handlePredictNumChange} placeholder="x"/>
        </div>
        <Button className="w-full my-2" onClick={Predict}>Predict</Button>

        {predictVal? (<p>value of cubic spine at {predictNumOutput} is {predictVal}</p>):(null)}
    </div>
  )
}

export default Prediction
