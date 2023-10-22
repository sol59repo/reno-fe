import React, { useState } from 'react'
import MUIDataTable from "mui-datatables"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { Small as Sm, FlexBox } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import { Icon, Fab } from '@mui/material'
import { useTheme, Box } from '@mui/system'
import { H5, Small } from 'app/components/Typography'

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

const Table = (props) => {
    const { materials } = props
    const _helpers = Helpers();
    const { palette } = useTheme()
    const textMuted = palette.text.secondary

    const [open, setOpen] = useState(false)

    const columns = [
        {
            name: "itemCode",
            label: "Item Code",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "itemName",
            label: "Item Name",
            options: {
                filter: true,
                sort: true,
                customBodyRenderLite: (dataIndex) => {
                    let Material = materials[dataIndex]
                    return (
                        <Box ml="12px">
                            <H5 sx={{ fontSize: '15px' }}>{Material?.itemName}</H5>
                        </Box>
                    )
                }
            }
        },
        {
            name: "qty",
            label: "Quantity",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Sm bgcolor={textMuted}>
                            {value}
                        </Sm>
                    )
                }
            }
        },
        {
            name: "status",
            label: "Status",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Sm bgcolor={_helpers.statusColor(value)}>
                            {value}
                        </Sm>
                    )
                }
            }
        },
        {
            name: "empName",
            label: "Added By",
            options: {
                filter: true,
                sort: true,
                customBodyRenderLite: (dataIndex) => {
                    let Material = materials[dataIndex]
                    return (

                        <FlexBox>
                            <Box ml="12px">
                                <H5 sx={{ fontSize: '15px' }}>{Material?.empName}</H5>
                                <Small sx={{ color: textMuted }}>
                                    Type:  {Material?.usertype}
                                </Small>
                            </Box>
                        </FlexBox>
                    )
                }
            }
        }
    ];

    const options = {
        search: true,
        download: false,
        print: false,
        viewColumns: false,
        filter: true,
        filterType: "dropdown",
        responsive: "vertical", // standard , simple,vertical,stacked
        tableBodyHeight: "100%",
        selectableRows: "none",
        rowsPerPage: 100,
        sortOrder: {
            name: 'id',
            direction: 'desc'
        },
        onTableChange: (action, state) => {

        },
        setTableProps: () => ({
            padding: "normal",
            size: "small"
        })
    }

    const handleOpen = (count) => {
        setOpen(true);
    }

    return (
        <>
            <CacheProvider value={muiCache}>
                <ThemeProvider theme={createTheme()}>
                    <MUIDataTable
                        title={"Consumables"}
                        data={materials}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
};


export default Table;