import {
    Card,
    Icon,
    MenuItem,
    IconButton,
    TextField,
    InputAdornment,
    ClickAwayListener,
    Button,
} from "@mui/material";
import ScrumBoardCard from "./ScrumBoardCard";
import Scrollbar from "react-perfect-scrollbar";
import { MatxMenu } from "app/components";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Box, styled } from "@mui/system";
import { H4 } from "app/components/Typography";
import { AlertConfirm } from "app/commons";
import ProjectLogic from "../logic/ProjectLogic";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Add from "@mui/icons-material/Add";

const FlexBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: "space-between",
}));

const StyledItem = styled(MenuItem)(() => ({
    minWidth: 148,
    display: "flex",
    alignItems: "center",
    "& span": { paddingLeft: "2px" },
}));

const StyledScrollBar = styled(Scrollbar)(() => ({
    height: "auto",
    position: "relative",
    paddingLeft: "16px",
    paddingRight: "16px",
}));

const StyledCard = styled(Card)(() => ({
    padding: "16px",
    width: "100%",
    borderRadius: 0,
    cursor: "pointer",
}));

const BoardList = ({
    data,
    handleCardClick,
    handleAddNewCard,
    renameList,
    geticketCardMembers,
    handleListArchived,
    handleCardArchived,
}) => {
    const [shouldOpenTitleEditor, setShouldOpenTitleEditor] = useState(false);
    const [shouldOpenAddCard, setShouldOpenAddCard] = useState(false);
    const [cardTitleText, setCardTitleText] = useState("");
    const [columnTitleText, setColumnTitleText] = useState("");

    const dispatch = useDispatch();
    const _logic = ProjectLogic();

    const handleChange = (event) => {
        let targetName = event.target.name;
        let value = event.target.value;

        if (targetName === "cardTitleText") {
            if (event.key === "Enter" && !event.shiftKey)
                AddNewCardFromEnter(cardTitleText);
            else setCardTitleText(value);
        } else {
            if (event.key === "Enter" && !event.shiftKey) handleRenameList();
            else setColumnTitleText(value);
        }
    };

    const handleRenameList = () => {
        openTitleEditor(false);
        renameList(columnTitleText, column.count);
    };

    const openTitleEditor = (value) => {
        setShouldOpenTitleEditor(value);
    };

    const openAddCard = (value) => {
        setShouldOpenAddCard(value);
    };

    const AddNewCardFromEnter = (cardTitleText) => {
        setCardTitleText("");
        handleAddNewCard(cardTitleText, column.count, column.cardSequence);
        setShouldOpenAddCard(false);
    };

    const AddNewCard = () => {
        if (cardTitleText.trim() !== "") {
            setCardTitleText("");
            handleAddNewCard(cardTitleText, column.count, column.cardSequence);
            setShouldOpenAddCard(false);
        }
    };

    useEffect(() => {
        let listTitle = data?.column?.name;
        if (listTitle) setColumnTitleText(listTitle);
    }, [data]);

    let { provided, snapshot, column } = data;

    let { cardLists = [] } = column;

    // console.log("column", column);
    // console.log("cardLists", cardLists);

    const bgLightGrey = "rgba(0, 0, 0, 0.01)";

    const newSequence = (_cardLists, _column) => {
        if (_cardLists.length === 0 && _column.cardSequence.length === 0) {
            return [];
        }

        let jsonString = _column.cardSequence[0].sequence;
        jsonString = jsonString.replace(/\\"/g, '"');
        jsonString = JSON.parse(jsonString);

        console.log("jsonString", jsonString);
        console.log("_cardLists", _cardLists);

        const filter = jsonString?.map((val) => {
            return _cardLists.filter(
                (val2) => val2.id.toString() === val.toString()
            )[0];
        });

        if (filter[0] === undefined) {
            return [];
        } else if (filter[filter?.length - 1] === undefined) {
            return filter.slice(0, -1);
        } else {
            return filter;
        }
    };

    return (
        <Card
            elevation={snapshot.isDragging ? 10 : 3}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
                ...provided.draggableProps.style,
            }}
            sx={{
                mx: "12px",
                pt: 1,
                width: 288,
                position: "relative",
                height: "100%",
            }}
        >
            <Droppable droppableId={column.id} direction="vertical" type="card">
                {(provided, snapshot) => (
                    <Box
                        ref={provided.innerRef}
                        position="relative"
                        style={{ background: "#ebecf0" }}
                    >
                        <JustifyBox pb={1}>
                            {shouldOpenTitleEditor ? (
                                <ClickAwayListener
                                    onClickAway={() => openTitleEditor(false)}
                                >
                                    <TextField
                                        size="small"
                                        sx={{ pl: 2 }}
                                        variant="outlined"
                                        value={columnTitleText}
                                        onChange={handleChange}
                                        onKeyDown={handleChange}
                                        name="columnTitleText"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={
                                                            handleRenameList
                                                        }
                                                    >
                                                        <Icon fontSize="small">
                                                            done
                                                        </Icon>
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </ClickAwayListener>
                            ) : (
                                <H4
                                    onClick={() => openTitleEditor(true)}
                                    sx={{
                                        py: "4px",
                                        pl: 2,
                                        flexGrow: 1,
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {column.name}
                                </H4>
                            )}
                            <MatxMenu
                                horizontalPosition="right"
                                menuButton={
                                    <IconButton>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                }
                            >
                                <StyledItem
                                    onClick={() =>
                                        handleListArchived(column.count)
                                    }
                                >
                                    <Icon> archived </Icon>
                                    <span> Archived </span>
                                </StyledItem>
                            </MatxMenu>
                        </JustifyBox>

                        <StyledScrollBar>
                            {/* {newSequence(cardLists, column)?.map(
                                (card, index) => ( */}
                            {cardLists?.map((card, index) => (
                                <Draggable
                                    key={card.id}
                                    draggableId={card.id}
                                    index={index}
                                    type="card"
                                >
                                    {(provided, snapshot) => (
                                        <Card
                                            sx={{
                                                mb: 2,
                                                borderRadius: "4px",
                                                background: bgLightGrey,
                                            }}
                                            elevation={
                                                snapshot.isDragging ? 10 : 3
                                            }
                                            onClick={() =>
                                                handleCardClick({
                                                    ...card,
                                                    listId: card.id,
                                                })
                                            }
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...provided.draggableProps
                                                    .style,
                                            }}
                                        >
                                            <ScrumBoardCard
                                                card={card}
                                                geticketCardMembers={
                                                    geticketCardMembers
                                                }
                                            ></ScrumBoardCard>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                        </StyledScrollBar>
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>

            {/* ===================================================== */}
            {shouldOpenAddCard ? (
                <ClickAwayListener onClickAway={() => openAddCard(false)}>
                    <StyledCard elevation={5}>
                        <TextField
                            size="small"
                            sx={{ mb: "12px" }}
                            variant="outlined"
                            name="cardTitleText"
                            value={cardTitleText}
                            fullWidth
                            onChange={handleChange}
                            onKeyDown={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => openAddCard(false)}
                                        >
                                            <Icon fontSize="small">clear</Icon>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                onClick={AddNewCard}
                                variant="contained"
                                color="primary"
                            >
                                Add
                            </Button>
                        </Box>
                    </StyledCard>
                </ClickAwayListener>
            ) : (
                <Box display="flex">
                    <ListItemButton
                        sx={{
                            minHeight: 30,
                            maxHeight: 30,
                            color: "#42526e",
                            background: "rgba(0, 0, 0, 0.01)",
                        }}
                        onClick={() => openAddCard(true)}
                    >
                        <ListItemIcon sx={{ color: "inherit" }}>
                            <Add />
                        </ListItemIcon>
                        <ListItemText
                            primary={"Add Card"}
                            primaryTypographyProps={{
                                fontSize: 14,
                                fontWeight: "medium",
                            }}
                        />
                    </ListItemButton>
                </Box>
            )}
        </Card>
    );
};

export default BoardList;
