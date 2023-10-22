import {
    Avatar,
    Button,
    Card,
    Divider,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { Box, styled, useTheme } from '@mui/system'
import { H4, H5, Small } from 'app/components/Typography'
import ProfileLogic from 'app/modules/profile/logic/ProfileLogic';
import { CircularProgress } from '@mui/material'
import Compress from "react-image-file-resizer";
import { setLoggedData } from 'app/redux/actions/userContextAction'
import { useDispatch, useSelector } from 'react-redux'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const ContentBox = styled(FlexBox)(() => ({
    flexDirection: 'column',
}))

const HiddenInput = styled('input')(() => ({
    display: 'none',
}))



const BasicInfo = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.usercontext);
    const _logic = ProfileLogic();
    const { info, getInfo } = props;
    const { palette } = useTheme()
    const textMuted = palette.text.secondary

    const [uploading, setUploading] = useState(false);
    const [state, setState] = useState({
        Address: "",
        Birthdate: "",
        Email: "",
        Gender: "",
    });

    useEffect(() => {
        setState({
            ...state,
            Email: info.email,
            Address: info.Address,
            Birthdate: info.birthdate,
            Gender: info.gender,
        })

    }, [info])

    const handleFileSelect = async (event) => {
        setUploading(true)
        const file = event.target.files[0]

        Compress.imageFileResizer(
            file, // the file from input
            480, // width
            480, // height
            "JPEG", // compress format WEBP, JPEG, PNG
            70, // quality
            0, // rotation
            (uri) => {
                console.log('uri', uri);

                // You upload logic goes here
                (async () => {
                    const body = new FormData();
                    body.append('file', uri);
                    body.append('fkUsercount', info.fkUsercount);
                    const response = await _logic.uploadProfile(body);
                    console.log('response', response);

                    if (response.status) {
                        await getInfo();
                        const { avatar } = response.apiRet.path;
                        let newData = { ...user }
                        newData.avatar = avatar;
                        dispatch(setLoggedData(newData));
                        setTimeout(() => {
                            setUploading(false)
                        }, 1000)
                    } else {
                        setUploading(false)
                    }
                })();

            },
            "file" // blob or base64 default base64
        );



    }


    console.log('info.avatar', info.avatar);


    return (
        <Card sx={{ pt: 3 }} elevation={3}>
            <ContentBox mb={3} alignContent="center">
                <label htmlFor="upload-single-file">
                    {uploading ?
                        (<CircularProgress className="progress" color="primary" />)
                        :
                        (<Avatar
                            sx={{ width: 84, height: 84 }}
                            src={info?.avatar}
                        />)
                    }

                </label>
                <HiddenInput
                    onChange={handleFileSelect}
                    id="upload-single-file"
                    type="file"
                />
                <H4 sx={{ mt: '16px', mb: '8px' }}>{info?.empName || ""}</H4>
                <Small sx={{ color: textMuted }}>ID: {info?.ID || ""}</Small>
            </ContentBox>

            <Divider />
            <Table sx={{ mb: 2 }}>
                <TableBody>
                    {Object.entries(state).map((item, ind) => (
                        <TableRow key={ind}>
                            <TableCell sx={{ pl: 2 }}>{item[0]}</TableCell>
                            <TableCell>{item[1]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};


export default BasicInfo;
