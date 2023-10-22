import React from 'react'
import { AllPages } from './routes/routes'
import { SnackbarProvider } from "notistack";
import { useRoutes } from 'react-router-dom'
import LoadingOverlay from 'react-loading-overlay';
import { useSelector } from 'react-redux';
import ScaleLoader from "react-spinners/ScaleLoader";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #0288d1;

`;


const AppBody = () => {
    LoadingOverlay.propTypes = undefined
    const { overlayLoader } = useSelector(state => state.common)
    const all_pages = useRoutes(AllPages())
    return (
        <LoadingOverlay
            active={overlayLoader.active}
            spinner={<ScaleLoader
                color={'rgb(255, 61, 87)'}
                loading={true}
                css={override}
                size={350}
                width={10}
                height={50}
            />}
            text={overlayLoader.text}
        >
            <SnackbarProvider
                autoHideDuration={3000}
                maxSnack={3}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                {all_pages}
            </SnackbarProvider>
        </LoadingOverlay>
    )
}

export default AppBody
