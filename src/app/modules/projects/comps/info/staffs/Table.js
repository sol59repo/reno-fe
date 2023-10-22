import React, { useState } from 'react'
import MUIDataTable from "mui-datatables"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { Small as Sm, StyledItem, FlexBox } from 'app/commons/StyledEl'
import Helpers from 'app/utils/Helpers'
import { Avatar, Icon, IconButton } from '@mui/material'
import { styled, useTheme, Box } from '@mui/system'
import { H5, Small } from 'app/components/Typography'
import { MatxMenu } from 'app/components'

const StyledAvatar = styled(Avatar)(() => ({
    height: '32px',
    width: '32px',
}))



const muiCache = createCache({
    key: "mui-datatables",
    prepend: true
});

const Table = (props) => {
    const { staffs, _handleStatus, _viewStaff } = props
    const _helpers = Helpers();
    const { palette } = useTheme()
    const textMuted = palette.text.secondary


    const columns = [
        {
            name: "empName",
            label: "Name",
            options: {
                filter: true,
                sort: true,
                customBodyRenderLite: (dataIndex) => {
                    let user = staffs[dataIndex]
                    return (


                        <FlexBox>
                            <StyledAvatar
                                sx={{ width: 48, height: 48 }}
                                src={user?.avatar}
                            />
                            <Box ml="12px">
                                <H5 sx={{ fontSize: '15px' }}>{user?.empName}</H5>
                                <Small sx={{ color: textMuted }}>
                                    ID:  {user?.ID}
                                </Small>
                            </Box>
                        </FlexBox>
                    )
                }
            }
        },
        {
            name: "gender",
            label: "Gender",
            options: { filter: true, sort: true, }
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
                filter: false, sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const { rowIndex } = tableMeta;
                    const { status, fkUser } = staffs[rowIndex];

                    return (
                        <>
                            <MatxMenu
                                menuButton={
                                    <IconButton>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                }
                            >
                                <StyledItem onClick={() => _viewStaff(value, tableMeta, updateValue)}>
                                    <Icon className="icon">info</Icon> View Info
                                </StyledItem>
                                <StyledItem onClick={_handleStatus(value, 'Active')}>
                                    <Icon className="icon">check_box</Icon> Active
                                </StyledItem>
                                <StyledItem onClick={_handleStatus(value, 'Inactive')}>
                                    <Icon className="icon">remove_circle_outline</Icon> Inactive
                                </StyledItem>

                                {status !== "Archived" &&
                                    <StyledItem onClick={_handleStatus(value, 'Archived')}>
                                        <Icon className="icon">archive</Icon>{' '}
                                        Archive
                                    </StyledItem>
                                }

                                <StyledItem >
                                    <Icon className="icon">access_time</Icon> Time Sheet
                                </StyledItem>


                            </MatxMenu>
                        </>
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
        // tableBodyMaxHeight: '400px',
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

    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
                <MUIDataTable
                    title={"Staffs Assigned"}
                    data={staffs}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>
        </CacheProvider>
    );
};


export default Table;