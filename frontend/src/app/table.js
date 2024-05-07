import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

function table({resData}) {
    return (
        <div className='overflow-x-auto grow'>
        
            <h2 className='font-bold text-xl'>Table</h2>
            <Table>
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
                    {resData.table.map((numsObj, key) => {
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
        </div>
    )
}

export default table
