import React, { useState } from 'react'
import MUIDataTable from "mui-datatables"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { Small as Sm } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import { Icon, Fab } from '@mui/material'
import { useTheme, Box } from '@mui/system'
import { H5, Small } from 'app/components/Typography'
import format from 'date-fns/format'
import { styled } from '@mui/system'
import { Dialogs } from 'app/commons';
import PoDetails from './PoDetails';
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic';


const addModalProps = {
    Title: "",
    size: "md",
}


export const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
}))

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

const Table = (props) => {
    const { po, _handleStatus } = props
    const _logic = ProjectLogic();
    const _helpers = Helpers();
    const { palette } = useTheme()
    const [open, setOpen] = useState(false)
    const [poData, setPoData] = useState([])
    const [poId, setPoId] = useState("")

    const columns = [
        {
            name: "Id",
            label: "Id",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "location",
            label: "Location",
        },
        {
            name: "dateAdded",
            label: "Date Added",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        {format(
                            new Date(value),
                            'MMMM dd, yyyy'
                        )}
                    </>
                }
            }
        }, {
            name: "empName",
            label: "Added By",
            options: {
                filter: true,
                sort: true,
                customBodyRenderLite: (dataIndex) => {
                    let Material = po[dataIndex]
                    return (
                        <Box ml="12px">
                            <H5 sx={{ fontSize: '15px' }}>{Material?.empName}</H5>
                        </Box>
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
            name: "count",
            label: "Action",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta;
                    const status = po[rowIndex].status
                    return (
                        <FlexBox>
                            <Fab
                                size='small'
                                className="button"
                                onClick={() => getPoDetails(value)}
                            >
                                <Icon fontSize='sm'>shopping_cart</Icon>
                            </Fab>
                            {status === "Approved" &&
                                <Fab
                                    size='small'
                                    className="button"
                                    onClick={() => _handleStatus(value, "Acknowledged")}
                                >
                                    <Icon fontSize='sm'>check_circle</Icon>
                                </Fab>
                            }
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

        }
    }

    const getPoDetails = async (id) => {
        const response = await _logic.getPoDetails(id);
        const POID = await po.filter(val => val.count === id);

        if (response) {
            setPoData(response);
            setOpen(true)
            setPoId(POID[0].Id)
        }
    }


    return (
        <>
            <CacheProvider value={muiCache}>
                <ThemeProvider theme={createTheme()}>
                    <MUIDataTable
                        title={"Consumables"}
                        data={po}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>

            <Dialogs
                {...addModalProps}
                closeModal={() => setOpen(false)}
                open={open}
                Content={() => <PoDetails poData={poData} poId={poId} />}
            />

        </>
    );
};


export default Table;