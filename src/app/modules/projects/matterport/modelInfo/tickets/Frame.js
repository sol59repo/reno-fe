import "./style.css"
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';



let iframe;
let addTagBtn;
let importBtn;
let exportBtn;
let removeBtn;
let sidSelector;
let container;
let tag;
let table_container;

const Frame = forwardRef((props, ref) => {
    return (
        <React.Fragment>
            <div className="container"
                style={{
                    backgroundColor: "yellow",
                    display: "flex"
                }}>
                adasasa
            </div>
        </React.Fragment>
    )
})


export default Frame;
