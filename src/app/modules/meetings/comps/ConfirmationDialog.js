import React, { Fragment, useEffect } from 'react'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/system'
import { H5, Paragraph, Small as Sm, Span } from 'app/components/Typography'
import Logic from 'app/modules/staffs/logic/Logic'
import { useDispatch, useSelector } from 'react-redux'


const options = [
    {
        name: 'tes tes',
        id: "12",
        selected: false
    },
    {
        name: 'tes tes',
        id: "123",
        selected: false
    },
    {
        name: 'tes tes',
        id: "1234",
        selected: false
    },
    {
        name: 'tes tes',
        id: "12345",
        selected: false
    },
]


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
}))


const StyledH5 = styled(H5)(() => ({
    marginLeft: '4px',
    fontWeight: '500',
}))

export default function ConfirmationDialog(props) {
    const _staffLogic = Logic();
    const [value, setValue] = React.useState('')
    const { OpenDialog, _handleDialogClose } = props
    const { staffLists } = useSelector(state => state.staffs)
    const [stafs, setStafs] = React.useState(staffLists)

    console.log('stafs',stafs);
    console.log('staffLists',staffLists);



    const { palette } = useTheme()
    const textMuted = palette.text.secondary

    useEffect(() => {
        _staffLogic.getLists({status:"All"});
    }, []);


    function handleOk() {
        handleClose(value)
    }

    function handleClose(newValue) {

        if (newValue) {
            setValue(newValue)
        }
        _handleDialogClose()
    }


    function handleCancel() {
        handleClose()
    }

    function handleChange(event, newValue) {
        setValue(newValue)
    }


    const handleCheckboxSelection = (event, index) => {
        console.log(event);
        console.log(index);
        event.persist()
        let temp = options
        temp[index].selected = event.target.checked
    }



    return (
        <Dialog

            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={OpenDialog}
        >
            <DialogTitle id="confirmation-dialog-title">
                List of Participants
            </DialogTitle>
            <DialogContent dividers>
                <FlexBox px={1} width="100%">
                    {staffLists.map((staf, index) => {
                        return (
                            <Fragment key={staf.ID.toString()}>
                                <Box style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Checkbox
                                        checked={staf.selected || false}
                                        onChange={(event) =>
                                            handleCheckboxSelection(
                                                event,
                                                index
                                            )
                                        }
                                        color="secondary"
                                    />
                                    <StyledH5
                                        sx={{
                                            fontSize: '14px',
                                            color: textMuted,
                                        }}
                                    >
                                        {`  ${staf.firstname} ${staf.lastname} - ${staf.usertype}`}
                                    </StyledH5>
                                </Box>
                            </Fragment>
                        );
                    })

                    }

                </FlexBox>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}
