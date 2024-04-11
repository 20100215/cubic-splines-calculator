"use client"; 
import Image from "next/image";
import {useState, useEffect} from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {

  const [formData, setFormData] = useState({
    x: [],
    y: []
  });

  const [data,setData] = useState({});
  const [img,setImg] = useState('');

  const [predictNum, setPredictNum] = useState(0);
  const [predictVal, setPredictVal] = useState();

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value.split(",").map(d => Number(d));
  
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }

  function handlePredictNumChange(e){
    setPredictNum(e.target.value);
  }

  async function Solve() {
    const dummyInput = {
      'x': formData.x,
      'y': formData.y
    };
    console.log(dummyInput);
    const res = await
    fetch("http://127.0.0.1:5555/solve",{
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(dummyInput)
    });

    const allPostsData = await res.json();
    setData(allPostsData);
    Plot();
  }

  function Plot(){
    axios.get('http://127.0.0.1:5555/plot', {
      headers: {
      'accept': 'image/png',
      },
      responseType: "arraybuffer"
  }).then(function (response) {
      console.log("ohwow");
      let base64ImageString = Buffer.from(response.data, 'binary').toString('base64');
      let srcURL = "data:image/png;base64, " + base64ImageString;
      setImg(srcURL);
  })
      .catch(function (error) {
      console.log(error);
  });
  } 

  function Predict(){
    axios.get('http://127.0.0.1:5555/predict', {
      params: {
        'val': '4'
      },
      headers: {
        'accept': 'application/json'
      }
    }).then(function (response) {
        setPredictVal(response.data.y);
    })
        .catch(function (error) {
        console.log(error);
    });
  }

  return (
    <main>
      <textarea name="x" onChange={handleChange}></textarea>
      <textarea name="y" onChange={handleChange}></textarea>

      <button onClick={Solve}>interpolate</button>

      <input name="predictNum" type="number" step="any" value={predictNum} onChange={handlePredictNumChange}/>
      <button onClick={Predict}>predict</button>
      
      
      
      {data.status ? (
        <Table>
          <TableCaption>table thingy</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>a</TableHead>
              <TableHead>b</TableHead>
              <TableHead>c</TableHead>
              <TableHead>d</TableHead>
              <TableHead>x</TableHead>
              <TableHead>y</TableHead>
              <TableHead>h</TableHead>
              <TableHead>S</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.table.map((numsObj, key) => {
              return (
                <TableRow key={key}>
                  <TableCell>{numsObj.a}</TableCell>
                  <TableCell>{numsObj.b}</TableCell>
                  <TableCell>{numsObj.c}</TableCell>
                  <TableCell>{numsObj.d}</TableCell>
                  <TableCell>{numsObj.x}</TableCell>
                  <TableCell>{numsObj.y}</TableCell>
                  <TableCell>{numsObj.h}</TableCell>
                  <TableCell>{numsObj.S}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )
      :(null)}

      {img ? (<Image height={500} width={500} src={img} alt="nothing"/>):(null)}

      {predictVal? (<p>value of cubic spine at {predictVal}</p>):(null)}
    </main>
  );
}
