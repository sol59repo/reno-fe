import React, { useState, useEffect } from 'react'
import {
    Grid,
    Card,
    Dialog,
    Button,
    IconButton
} from '@mui/material'

import { Box, padding, styled } from '@mui/system'
import { H6, Paragraph } from 'app/components/Typography'
import Attachment from '@mui/icons-material/Attachment';
import format from 'date-fns/format'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import ProjectLogic from 'app/modules/projects/logic/ProjectLogic';
import CommonLogic from 'app/logic/CommonLogic';
import { AlertConfirm } from 'app/commons';

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))


const Heading = styled(H6)(({ theme }) => ({
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
}))

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    paddingTop: '16px !important',
    flexDirection: 'center',
    background: theme.palette.background.default,
}))

const ContentBox = styled(Box)(({ theme }) => ({
    padding: '0px 24px !important',
    paddingTop: '16px !important',
    [theme.breakpoints.down('sm')]: {
        padding: '0px 12px !important',
    },
}))

const IMG = styled('img')(({ theme }) => ({
    width: '30%',
}))

const IMGDIALOG = styled('img')(({ theme }) => ({
    width: '100%',
}))



const Attachments = ({
    attachments,
    getCardActivities
}) => {

    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();

    const [shownImage, setShownImage] = useState(false);
    const [url, setUrl] = useState('');



    const showImage = (url) => {
        setShownImage(true);
        setUrl(url);
    }

    const handleDelete = async (file) => {
        const data = {
            count: file.count,
            fileName: file.fileName,
            fkCard: file.fkCard,
            addedBy: _commonLogic.getId()
        }

        AlertConfirm({
            callback: () => confirmDelete(data),
            title: 'Remove attachment?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: "No, cancel!"
        });
    }


    const confirmDelete = async (data) => {
        const response = await _logic.deleteAttachment(data);
        if (response) {
            getCardActivities()
        }
    }

    const renderAttachments = () => {
        const _attachments = attachments.map((file, id) => {
            const formatDate = new Date(file.dateTime);
            const dateTime = format(formatDate, "MMM d, yyyy 'at' h:m a");

            return (
                <Grid
                    key={id}
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}

                >
                    <FlexBox>
                        <StyledCard>
                            <IMG src={file.filePath} alt="cover" onClick={() => showImage(file.filePath)} />

                            <Box ml={2} sx={{
                                display: "flex",
                                flexDirection: 'column'
                            }}>
                                <Heading sx={{ color: '#42526e' }} onClick={() => showImage(file.filePath)} >
                                    {file.fileName}
                                </Heading>
                                <Heading sx={{ textTransform: 'capitalize' }} onClick={() => showImage(file.filePath)}>
                                    Added last   {dateTime}
                                </Heading>
                                <div className="button-group">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color={'error'}
                                        sx={{
                                            mr: '4px',
                                            fontSize: '0.8125rem',
                                            textTransform: 'capitalize',
                                            height: 20
                                        }}
                                        onClick={() => handleDelete(file)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Box>
                        </StyledCard>
                    </FlexBox>
                </Grid>
            );
        })

        return _attachments;
    }

    return (
        <>
            <ContentBox pt={0}>
                <FlexBox >
                    <Attachment sx={{ color: '#42526e' }} />
                    <Heading sx={{ ml: 2, color: '#42526e' }}>Attachment</Heading>
                </FlexBox>
                <Box className="comments">
                    <Grid container spacing={2}>
                        {renderAttachments()}
                    </Grid>
                </Box>
                <ImageDialog
                    url={url}
                    shownImage={shownImage}
                    setShownImage={setShownImage}
                />
            </ContentBox >
        </>
    );
};

export default Attachments;



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export const ImageDialog = ({
    url,
    shownImage,
    setShownImage
}) => {

    return (
        <Dialog
            open={shownImage}
            fullScreen
            fullWidth={true}
            onClose={() => setShownImage(false)}
            TransitionComponent={Transition}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                }
            }}
        >
            <AppBar sx={{ position: 'relative', background: 'transparent' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="error"
                        onClick={() => setShownImage(false)}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box sx={{
                width: '85%',
                alignSelf: 'center',
            }}>
                <IMGDIALOG src={url} alt="cover" />
            </Box>
        </Dialog>
    );
}