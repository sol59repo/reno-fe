import React, { useEffect, useState } from "react";
import {
    Icon,
    IconButton,
    Avatar,
    Tooltip,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

import { MatxMenu } from "app/components";
import { Link, useParams } from "react-router-dom";
import ScrumBoardContainer from "./ScrumBoardContainer";
import { useDispatch, useSelector } from "react-redux";
import { Box, styled } from "@mui/system";
import { H5, Span } from "app/components/Typography";
import shortId from "shortid";
import ProjectLogic from "../logic/ProjectLogic";
import { useSnackbar } from "notistack";
import CommonLogic from "app/logic/CommonLogic";
import { AlertConfirm } from "app/commons";

const Container = styled("div")(({ theme }) => ({
    margin: "2px",
    height: "100%",
    background: "#e9e9e9",
    [theme.breakpoints.down("sm")]: {
        margin: "16px",
    },
}));

const FlexBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
    flexWrap: "wrap",
    justifyContent: "space-between",
}));

const StyledAvatar = styled(Avatar)(() => ({
    width: 24,
    height: 24,
    marginLeft: "-8px",
    border: "2px solid white",
}));

const Board = ({ LocationName }) => {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const _logic = ProjectLogic();
    const _commonLogic = CommonLogic();
    const { id } = useParams();
    const [cardList, setCardList] = useState([]);

    const [cardListSequence, setCardListSequence] = useState([]);
    const [cardSequence, setCardSequence] = useState(new Object());

    const title = LocationName;

    useEffect(() => {
        getCardLists();
        getSequence();
    }, []);

    const handleAddList = async (newList) => {
        if (newList === "") {
            enqueueSnackbar(`Please enter list title`, { variant: "error" });
        }

        const generatedId = shortId.generate();
        const bodyData = {
            id: generatedId,
            modelId: id,
            name: newList,
            status: "Active",
            cardListSequence: JSON.stringify(cardListSequence),
        };

        const response = await _logic.addCardList(bodyData);
        if (response.status) {
            getCardLists();
            getSequence();
        }
    };

    const renameList = async (newListName, count) => {
        if (newListName === "") {
            enqueueSnackbar(`Please enter list title`, { variant: "error" });
        }

        const bodyData = {
            count: count,
            name: newListName,
        };

        const response = await _logic.renameList(JSON.stringify(bodyData));
        if (response) {
            getCardLists();
            getSequence();
        }
    };

    const getCardLists = async () => {
        const response = await _logic.getCardLists(id);
        setCardList(response);
    };

    const getSequence = async () => {
        const response = await _logic.getSequence(id);
        if (response.length > 0) {
            let jsonString = response[0].cardListSeq;
            jsonString = jsonString.replace(/\\"/g, '"');
            const data_ = JSON.parse(jsonString);
            setCardListSequence(data_);
        }
    };

    const handleAddNewCard = async (cardTitleText, listCount, cardSequence) => {
        const generatedId = shortId.generate();
        const sequence = JSON.parse(cardSequence[0].sequence);
        sequence.push(generatedId);

        const _data = {
            id: generatedId,
            fkCardList: listCount,
            summary: cardTitleText,
            addedBy: _commonLogic.getCount(),
            cardSequence: JSON.stringify(sequence),
            modelId: id,
        };

        const response = await _logic.addCard(_data);

        if (response.status) {
            getCardLists();
            getSequence();
        }
    };

    const moveCardList = async (
        sourcelistId,
        destinationlistId,
        source,
        destination
    ) => {
        const sourceItems = cardList.find((list) => list.id === sourcelistId);
        let spliced = JSON.parse(sourceItems.cardSequence[0].sequence);
        let [moveItem] = spliced.splice(source.index, 1);

        const destinationItems = cardList.find(
            (list) => list.id === destinationlistId
        );
        let parsedDestination = JSON.parse(
            destinationItems.cardSequence[0].sequence
        );
        let addedItem = parsedDestination.splice(
            destination.index,
            0,
            moveItem
        );

        const responseBody1 = {
            fkCardList: sourceItems.cardSequence[0].fkCardList,
            sequence: JSON.stringify(spliced),
        };

        const responseBody2 = {
            fkCardList: destinationItems.cardSequence[0].fkCardList,
            sequence: JSON.stringify(parsedDestination),
        };

        await _logic.updateCardInListSequence(JSON.stringify(responseBody1));
        await _logic.updateCardInListSequence(JSON.stringify(responseBody2));

        const response2 = await _logic.updateCard(
            JSON.stringify({
                id: moveItem,
                fkCardList: destinationItems.cardSequence[0].fkCardList,
            })
        );

        if (response2) {
            getCardLists();
            getSequence();
        }
    };

    const reorderList = async (sourceindex, destinationindex) => {
        const result = Array.from(cardListSequence);
        const [removed] = result.splice(sourceindex, 1);
        result.splice(destinationindex, 0, removed);
        setCardListSequence(result);

        const body = {
            modelId: id,
            cardListSeq: result,
        };

        const response = await _logic.updateCardListSequence(
            JSON.stringify(body)
        );
        if (response) {
            getCardLists();
            getSequence();
        }
    };

    const saveReorderCard = async (
        listArray,
        sourceindex,
        destinationindex
    ) => {
        const result = Array.from(JSON.parse(listArray[0].sequence));
        const [removed] = result.splice(sourceindex, 1);
        result.splice(destinationindex, 0, removed);
        setCardSequence(result);

        const body = {
            fkCardList: listArray[0].fkCardList,
            sequence: JSON.stringify(result),
        };

        const response = await _logic.updateCardInListSequence(
            JSON.stringify(body)
        );
        if (response) {
            getCardLists();
            getSequence();
        }

        return JSON.stringify(result);
    };

    const reorderCard = async (
        sourcedroppableId,
        sourceindex,
        destinationindex
    ) => {
        const result = cardList.map((board) => {
            if (board.id === sourcedroppableId) {
                return {
                    ...board,
                    cardSequence: saveReorderCard(
                        board.cardSequence,
                        sourceindex,
                        destinationindex
                    ),
                };
            }
            return board;
        });
    };

    const newSequence = () => {
        const filter = cardListSequence.map((val) => {
            return cardList.filter((val2) => val2.id == val)[0];
        });
        if (filter[0] === undefined) {
            return [];
        } else if (filter[filter?.length - 1] === undefined) {
            return filter.slice(0, -1);
        } else {
            return filter;
        }
    };

    const handleListArchived = (count) => {
        const getref = cardList.filter((val) => val.count === count);
        const { id } = getref[0];
        const removeId = cardListSequence.filter((val) => val != id);
        AlertConfirm({
            callback: () => _confirmArchived(count, removeId),
            title: "Archive this list?",
            text: "Please confirm!",
            icon: "warning",
            confirmButtonText: "Yes, proceed!",
            cancelButtonText: "No, cancel!",
        });
    };

    const _confirmArchived = async (count, removeId) => {
        const response = await _logic.archiveList({
            count: count,
            modelId: id,
            newCrdListSeq: removeId,
        });
        if (response) {
            getCardLists();
            getSequence();
        }
    };

    const handleCardArchived = (fkCardList, cardId) => {
        const getref = cardList.filter((val) => val.count == fkCardList);
        const { sequence } = getref[0].cardSequence[0];
        const parsedSeq = JSON.parse(sequence);
        const filterNewSeq = parsedSeq.filter((val) => val != cardId);

        AlertConfirm({
            callback: () =>
                _confirmArchivedCard(cardId, filterNewSeq, fkCardList),
            title: "Archive this list?",
            text: "Please confirm!",
            icon: "warning",
            confirmButtonText: "Yes, proceed!",
            cancelButtonText: "No, cancel!",
        });
    };

    const _confirmArchivedCard = async (cardId, filterNewSeq, fkCardList) => {
        const response = await _logic.archiveCard({
            count: cardId,
            fkCardList: fkCardList,
            filterNewSeq: filterNewSeq,
        });
        if (response) {
            getCardLists();
            getSequence();
        }
    };

    console.log("cardList", cardList);
    console.log("cardListSequence()", cardListSequence);

    return (
        <Container className="scrum-board">
            <JustifyBox mb={2}>
                <FlexBox>
                    <H5 sx={{ ml: 1, textTransform: "capitalize" }}>{title}</H5>
                </FlexBox>
            </JustifyBox>

            <Box position="relative">
                <ScrumBoardContainer
                    list={newSequence()}
                    cardList={cardList}
                    handleAddList={handleAddList}
                    renameList={renameList}
                    handleAddNewCard={handleAddNewCard}
                    moveCardList={moveCardList}
                    reorderList={reorderList}
                    reorderCard={reorderCard}
                    getCardLists={getCardLists}
                    getSequence={getSequence}
                    handleListArchived={handleListArchived}
                    handleCardArchived={handleCardArchived}
                ></ScrumBoardContainer>
            </Box>
        </Container>
    );
};

export default Board;
