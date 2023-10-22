import { Box, styled } from '@mui/system'


const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        margin: '30px',
        [theme.breakpoints.down('sm')]: {
            margin: '16px',
        },
    },
}))

const UnderDev = () => {

    return (
        <Container>
            <h1>Under Development!</h1>
        </Container>
    )
}

export default UnderDev
