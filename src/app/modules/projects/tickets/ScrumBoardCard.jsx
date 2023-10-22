import React, { useState, useEffect } from 'react'
import ScrumBoardLabelBar from './ScrumBoardLabelBar'
import { Button, Icon, Avatar } from '@mui/material'
import { useSelector } from 'react-redux'
import { Box, styled } from '@mui/system'
import { H6 } from 'app/components/Typography'
import CommonLogic from 'app/logic/CommonLogic'
import ProjectLogic from '../logic/ProjectLogic'

const ContentBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: "space-between",
    marginTop: '12px',
    fontSize: '0.8125rem',

}))

const StyledAvatar = styled(Avatar)(() => ({
    height: '32px',
    width: '32px',
}))

const IMG = styled('img')(() => ({
    width: '100%',
    borderRadius: '4px',
}))

const ScrumBoardCard = ({ card, geticketCardMembers }) => {

    const _commonlogic = CommonLogic();
    const _logic = ProjectLogic();


    const [comments, setComments] = useState([])
    const [cardMembers, setCardMembers] = useState([])

    let {
        summary,
        coverImage,
        status
    } = card




    useEffect(async () => {
        getCardActivities()
        const response = await geticketCardMembers(card.count);
        setCardMembers(response)
        
    }, []);

    const getCardActivities = async () => {
        const response = await _logic.getCardActivities(card.count);
        setComments(response);
    }

 
    const LabelStatus = JSON.parse(status)

    return (
        <div className="scrum-board-card">
            {coverImage && <IMG src={coverImage} alt="stair" />}
            <Box px={2} py="12px" style={{ backgroundColor: '#fff' }}>
                {LabelStatus?.length !== 0 && (
                    <Box mb="12px" display="flex" fontWeight="500">
                        {LabelStatus?.map(
                            (label) =>
                                label && (
                                    <ScrumBoardLabelBar
                                        key={label.id}
                                        color={label.color}
                                    />
                                )
                        )}
                    </Box>
                )}
                <H6>{summary}</H6>

                {(comments?.length !== 0 ||
                    cardMembers?.length !== 0) && (
                        <ContentBox className="button-group">
                            <Box display="flex">
                                {comments?.length !== 0 && (
                                    <Button size="small">
                                        <Icon
                                            fontSize="small"
                                            sx={{
                                                mr: '4px',
                                                fontSize: '0.8125rem',
                                            }}
                                        >
                                            chat
                                        </Icon>
                                        <span>{comments?.length}</span>
                                    </Button>
                                )}

                            </Box>
                            <Box ml="-0.875rem"
                                display="flex"
                                position="relative"
                            >
                                {cardMembers?.map(
                                    (member) =>
                                        member && (
                                            <StyledAvatar
                                                key={member.userID}
                                                src={member.avatar}
                                            />
                                        )
                                )}
                            </Box>
                        </ContentBox>
                    )}
            </Box>
        </div>
    )
}

export default ScrumBoardCard
