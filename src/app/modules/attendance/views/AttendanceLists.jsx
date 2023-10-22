import React, { useState, useEffect } from 'react';
import { Container } from "../../../commons/StyledEl"
import { Breadcrumb, SimpleCard } from 'app/components'
import AttendanceData from '../comps/AttendanceData';
import InfoDialog from '../comps/InfoDialog';
import { Divider } from '@mui/material';
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic';
import format from 'date-fns/format';

const AttendanceLists = (props) => {
    const _logic = ProjectLogic();

    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [singleData, setSingleData] = useState([]);
    const [rowData, setRowData] = useState({});
    const [from, setFrom] = useState(new Date());
    const [to, setTo] = useState(new Date());

    useEffect(() => {
        getEmployeesAttendance(from, to);
    }, [])

    const getEmployeesAttendance = async (_from, _to) => {
        const data = {
            from: format(new Date(_from), 'yyyy-MM-dd'),
            to: format(new Date(_to), 'yyyy-MM-dd')
        }

        const response = await _logic.getEmployeesAttendance(data);
        console.log(response);
        setData(response);
    }

    const viewInfo = async (userId, rowData) => {
        const data = {
            from: format(new Date(from), 'yyyy-MM-dd'),
            to: format(new Date(to), 'yyyy-MM-dd'),
            fkUser: userId
        }

        const response = await _logic.getEmployeeAttendance(data);
        setRowData(rowData)
        setSingleData(response)
        setOpen(true)
    }

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Attendance', path: '/attendance/list' },
                    ]}
                />
            </div>
            <AttendanceData
                getEmployeesAttendance={getEmployeesAttendance}
                viewInfo={viewInfo}
                data={data}
                setFrom={setFrom}
                setTo={setTo}
                from={from}
                to={to}
            />
            <InfoDialog
                rowData={rowData}
                singleData={singleData}
                open={open}
                handleClose={setOpen}
            />
        </Container>
    );
};



export default AttendanceLists;