import React, { useState, useEffect } from 'react'
import { Box, styled } from '@mui/system'
import { Paragraph} from 'app/components/Typography'


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))


const Title = ({ listName }) => {
    return (
        <FlexBox>
            <FlexBox style={{
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Paragraph
                    sx={{
                        mb: 2,
                        fontSize: '1rem',
                        color: '#42526e',
                        marginRight: .5
                    }}
                >
                    in list
                </Paragraph>
            </FlexBox>
            <FlexBox>
                <Paragraph
                    sx={{
                        mb: 2,
                        fontSize: '1rem',
                        color: '#42526e',
                        fontWeight: 'bold',
                        textDecoration: "underline"
                    }}
                >
                    {listName.toLocaleUpperCase()}
                </Paragraph>
            </FlexBox>
        </FlexBox>
    );
};

export default Title;