import React from 'react'
import { useState } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


export default function Matrix({data}) {
	return (
		<div>
            <Table>
                <TableBody>  
                    {data.map((arr, key) =>{
                        return(
                            <TableRow key={key}>
                                {arr.map((item, key2) => {
                                    return(
                                        <TableCell key={key2}>{item}</TableCell>
                                    )
                                })}
                            </TableRow>
                        )

                    })}
                 
                </TableBody>
            </Table>
        </div>
	);
}
