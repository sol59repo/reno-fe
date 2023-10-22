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
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic';


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
    const { logs, _handleStatus } = props
    const _logic = ProjectLogic();
    const _helpers = Helpers();
    const { palette } = useTheme()

    const columns = [
        {
            name: "dateTime",
            label: "Date Added",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <>
                        {format(
                            new Date(value),
                            'MMMM dd, yyyy h:m'
                        )}
                    </>
                }
            }
        },
        {
            name: "ID",
            label: "Id",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "refId",
            label: "Reference",
        },
        {
            name: "empName",
            label: "Added By",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "description",
            label: "Description",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "type",
            label: "type",
            options: {
                filter: true,
                sort: false,
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


    return (
        <>
            <CacheProvider value={muiCache}>
                <ThemeProvider theme={createTheme()}>
                    <MUIDataTable
                        title={"Material Logs"}
                        data={logs}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </>
    );
};


export default Table;