import React from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";


export default function S({data}) {
    // data = data.splice(data.length,0);
	return (
		<div>
            <Table>
                <TableBody>  
                    {data.map((item, key) =>{
                        if(key != 0 && key != data.length-1){
                            return(
                                <TableRow key={key}>
                                            <TableCell>{item}</TableCell>
                                </TableRow>
                            )
                        }
                    })}
                 
                </TableBody>
            </Table>
        </div>
	);
}
