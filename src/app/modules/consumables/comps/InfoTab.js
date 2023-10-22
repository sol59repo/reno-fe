import React, { useState } from 'react'
import {
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
} from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import { SimpleCard } from 'app/components'



const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: 'pre',
    '& thead': {
        '& tr': {
            '& th': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    },
    '& tbody': {
        '& tr': {
            '& td': {
                paddingLeft: 0,
                textTransform: 'capitalize',
            },
        },
    },
}))


const InfoTab = ({ Info }) => {
    const { itemName, qty } = Info
    return (
        <SimpleCard title={"Item Details"}>
            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Info</TableCell>
                        <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="left">
                            {itemName}
                        </TableCell>
                        <TableCell align="left">
                            {qty}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </StyledTable>
        </SimpleCard>
    );
};



export default InfoTab;