import React from "react";
import {
    Icon,
    Tooltip,
    IconButton,
} from '@mui/material'
import { styled } from '@mui/system'
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { withStyles } from "tss-react/mui";

const defaultToolbarSelectStyles = {
    iconButton: {
    },
    iconContainer: {
        marginRight: "24px",
    },
    inverseIcon: {
        transform: "rotate(90deg)",
    },
};


const StyledIcon = styled(Icon)(() => ({
    color: 'grey',
}))

class CustomToolbarSelect extends React.Component {
    handleClickInverseSelection = () => {
        const nextSelectedRows = this.props.displayData.reduce((nextSelectedRows, _, index) => {
            if (!this.props.selectedRows.data.find(selectedRow => selectedRow.index === index)) {
                nextSelectedRows.push(index);
            }

            return nextSelectedRows;
        }, []);

        this.props.setSelectedRows(nextSelectedRows);
    };

    handleClickDeselectAll = () => {
        this.props.setSelectedRows([]);
    };

    handleClickBlockSelected = () => {
        console.log(`block users with dataIndexes: ${this.props.selectedRows.data.map(row => row.dataIndex)}`);
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.iconContainer}>

                <Tooltip title={"Active selected"}>
                    <IconButton className={classes.iconButton} onClick={{}}>
                        <StyledIcon>check_box</StyledIcon>
                    </IconButton>
                </Tooltip>

                <Tooltip title={"Inactive selected"}>
                    <IconButton className={classes.iconButton} onClick={{}}>
                        <IndeterminateCheckBoxIcon className={classes.icon} />
                    </IconButton>
                </Tooltip>

                <Tooltip title={"Archive selected"}>
                    <IconButton className={classes.iconButton} onClick={{}}>
                        <StyledIcon>archive</StyledIcon>
                    </IconButton>
                </Tooltip>

            </div>
        );
    }
}

export default withStyles(CustomToolbarSelect, defaultToolbarSelectStyles, { name: "CustomToolbarSelect" });