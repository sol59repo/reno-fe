import React, { useState } from 'react'
import MUIDataTable from "mui-datatables"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { Small as Sm, StyledItem } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import { Icon, Fab, IconButton } from '@mui/material'
import { useTheme, Box } from '@mui/system'
import { H5, Small } from 'app/components/Typography'
import format from 'date-fns/format'
import { styled } from '@mui/system'
import { Dialogs } from 'app/commons';
import PoDetails from './PoDetails';
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic';
import { MatxMenu } from 'app/components'
import CommonLogic from 'app/logic/CommonLogic';


const addModalProps = {
    Title: "",
    size: "md",
}


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
}))

const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

const TablePurchaseOrder = (props) => {
    const { purchasedOrderLists, _handleStatus, _handleDecline } = props
    const _commonLogic = CommonLogic();
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
            label: "Requested By",
            options: {
                filter: true,
                sort: true,
                customBodyRenderLite: (dataIndex) => {
                    let Material = purchasedOrderLists[dataIndex]
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
                    const status = purchasedOrderLists[rowIndex].status
                    const modelId = purchasedOrderLists[rowIndex].modelId

                    return (
                        <FlexBox>
                            <Fab
                                size='small'
                                className="button"
                                onClick={() => getPoDetails(value)}
                            >
                                <Icon fontSize='sm'>shopping_cart</Icon>
                            </Fab>
                            {status === "For Approval" && _commonLogic.getUsertype() === "Superadmin" &&
                                < MatxMenu
                                    menuButton={
                                        <IconButton>
                                            <Icon>more_vert</Icon>
                                        </IconButton>
                                    }
                                >
                                    <StyledItem onClick={_handleStatus(value, 'Approved', modelId)}>
                                        <Icon className="icon">check_box</Icon> Approve
                                    </StyledItem>
                                    <StyledItem onClick={_handleDecline(value, 'Declined', modelId)}>
                                        <Icon className="icon">remove_circle_outline</Icon> Decline
                                    </StyledItem>
                                </MatxMenu>

                            }
                        </FlexBox >
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
        const POID = await purchasedOrderLists.filter(val => val.count === id);

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
                        data={purchasedOrderLists}
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


export default TablePurchaseOrder;