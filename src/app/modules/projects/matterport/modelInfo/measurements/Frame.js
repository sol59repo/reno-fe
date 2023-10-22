import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { GetSDK } from '../../Sdk.js';
import shortid from "shortid";
import Helpers from 'app/utils/Helpers.js';

const _applicationKey = process.env.REACT_APP_MATTERPORT_APPLICATION_KEY;

const isFirefox = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf("Firefox") > -1 : false;
let iframe;
let table_container;
let isReady = false;

let tag;
let isTagging = false;
let addingTag;
let movingTag;

const colors = [
    { r: 0.9, g: 0.9, b: 0 }, //yellow
    { r: 0.0, g: 0.0, b: 1.0 }, //blue
    { r: 1, g: 0, b: 0 }, //red
    { r: 0.11, g: 0.40, b: 0.49 }, // purple
    { r: 1, g: 0, b: 0.019 }, // 
    { r: 0.509, g: 0.615, b: 0.6784 }, // 
]


let pushTags = []

const Frame = forwardRef((props, ref) => {
    const {
        _setMpSdk,
        srcEmbed,
        addNewTag,
        _tag
    } = props

    const _helpers = Helpers();
    const [mpSdk, setMpSdk] = useState();
    const iframeRef = useRef(null);

    useEffect(() => {
        _getsdk();
    }, [iframeRef]);

    const _getsdk = async () => {
        let mpSdk = await GetSDK(iframeRef.current, _applicationKey);
        setTimeout(() => {
            setMpSdk(mpSdk);
            _setMpSdk(mpSdk);
            _onSdkConnect(mpSdk);
        }, 600);
    }

    const _onSdkConnect = async (mpSdk) => {
        if (!isFirefox) {
            _focusDetect(mpSdk);
        }

        table_container = document.querySelector(".scrollable");
        iframe = document.querySelector('.showcase-iframe');

        mpSdk.Measurements.data.subscribe({
            onAdded: function (index, item, collection) {
                if (isReady) {
                    (async () => {
                        await getMeasurements(item.points, mpSdk);
                        await populateTags(mpSdk);
                        pushTags = []
                    })();
                }
            },
            onRemoved: function (index, item, collection) {
            },
            onUpdated: function (index, item, collection) {
            },
            onCollectionUpdated: function (collection) {
            }
        });

        mpSdk.Measurements.mode.subscribe((measurementModeState) => {
            // measurement mode state has changed
            setTimeout(() => {
                isReady = true;
            }, 5000)
        });

        mpSdk.Pointer.intersection.subscribe(intersectionData => {
            if (tag && !movingTag && isTagging) {
                if (intersectionData.object === 'intersectedobject.model' || intersectionData.object === 'intersectedobject.sweep') {
                    _updateTagPos(intersectionData.position, intersectionData.normal, undefined, mpSdk);
                }
            }
        });
    }


    function _updateTagPos(newPos, newNorm = undefined, scale = undefined, mpSdk = {}) {
        if (!newPos) return;
        if (!scale) scale = .33;
        if (!newNorm) newNorm = { x: 0, y: 1, z: 0 };

        mpSdk.Mattertag.editPosition(tag, {
            anchorPosition: newPos,
            stemVector: {
                x: scale * newNorm.x,
                y: scale * newNorm.y,
                z: scale * newNorm.z,
            }
        })
            .catch(e => {
                console.error(e);
                tag = null;
                movingTag = false;
            });
    }

    function _focusDetect(mpSdk) {
        const eventListener = window.addEventListener('blur', function () {
            if (document.activeElement === iframe) {
                _placeTag(mpSdk); //function you want to call on click
                setTimeout(function () { window.focus(); }, 0);
            }
            window.removeEventListener('blur', eventListener);
        });
    }

    const _overlayDetect = (mpSdk) => {
        if (tag) {
            const overlay = document.createElement('div');
            overlay.setAttribute('class', 'click-overlay');
            overlay.addEventListener('mousemove', e => {
                mpSdk.Renderer.getWorldPositionData({
                    x: e.clientX - 30,
                    y: e.clientY - 5
                })
                    .then(data => {
                        _updateTagPos(data.position, undefined, undefined, mpSdk);
                    })
                    .catch(e => {
                        console.error(e);
                        _placeTag(mpSdk);
                    });

            });
            overlay.addEventListener('click', e => {
                _placeTag(mpSdk);
                overlay.remove();
            });
            table_container.insertAdjacentElement('beforeend', overlay);
        }
    }


    const getMeasurements = async (measurements, mpSdk) => {
        for (let index = 0; index < measurements.length; index++) {
            if (index === measurements.length - 1) {

            } else {
                const item = [measurements[index], measurements[index + 1]]
                await populateMeasurements(item, mpSdk, index);
            }
        }
    }

    const populateMeasurements = async (item, mpSdk, index) => {
        const x0 = parseFloat(item[0].x);
        const x1 = parseFloat(item[1].x);
        const y0 = parseFloat(item[0].y);
        const y1 = parseFloat(item[1].y);
        const z0 = parseFloat(item[0].z);
        const z1 = parseFloat(item[1].z);

        const _measurement = await Math.pow((x0 - x1), 2) + Math.pow((y0 - y1), 2) + Math.pow((z0 - z1), 2);
        const measurement = await Math.pow(_measurement, 1 / 2);
        const anchorPosition = {
            x: (x0 + x1) / 2,
            y: (y0 + y1) / 2,
            z: (z0 + z1) / 2
        }

        mpSdk.Mattertag.add([{
            label: "",
            description: `${measurement.toFixed(2)} meters`,
            anchorPosition: anchorPosition,
            stemVector: {
                x: 0,
                y: 0.50,
                z: 0
            },
            color: { r: 0.509, g: 0.615, b: 0.6784 }
        }])
            .then((sid) => {
                tag = sid[0];
                console.log('index', index, "---", tag);
                pushTags.push(tag);
                return mpSdk.Mattertag.getData();
            })
            .then((collection) => {

            })
            .then(() => {
                if (isFirefox) _overlayDetect(mpSdk);
            })
            .catch((e) => {
                console.error(e);
            })
    }


    const populateTags = (mpSdk) => {
        mpSdk.Mattertag.getData()
            .then((collection) => {
                const measurementID = shortid.generate();
                for (let i = 0; i < pushTags.length; i++) {

                    const t_sid = collection.filter(elem => elem.sid == pushTags[i]);
                    if (t_sid.length !== 0) {
                        const refWithId = {
                            refId: shortid.generate(),
                            measurementID: measurementID,
                            status: "Pending"
                        }
                        addNewTag(t_sid, refWithId, mpSdk);
                    }
                }
            });
    }


    const _placeTag = (mpSdk) => {
        if (tag) mpSdk.Mattertag.navigateToTag(tag, mpSdk.Mattertag.Transition.FLY);
        tag = null;
        movingTag = false;
        isTagging = false;
    }


    useImperativeHandle(ref, () => ({
        _addNewTag(mpSdk) {
            if (mpSdk) {
                if (!addingTag && !tag) {
                    addingTag = true;
                    isTagging = true;
                    mpSdk.Mattertag.add([{
                        label: "",
                        description: ``,
                        refId: shortid.generate(),
                        anchorPosition: { x: 0, y: 0, z: 0 },
                        stemVector: { x: 0, y: 0, z: 0 },
                        color: _helpers.statusRGB("Pending")
                    }])
                        .then((sid) => {
                            tag = sid[0];
                            return mpSdk.Mattertag.getData();
                        })
                        .then((collection) => {
                            addingTag = false;
                        })
                        .then(() => {
                            if (isFirefox) _overlayDetect(mpSdk);
                        })
                        .catch((e) => {
                            console.error(e);
                            addingTag = false;
                        })
                }
            }
        }
    }))

    return (
        <>
            <iframe
                crossOrigin="true"
                ref={iframeRef}
                id='showcase-iframe'
                className='showcase-iframe'
                src={`https://my.matterport.com/show?m=${srcEmbed}&play=1&applicationKey=${_applicationKey}`}
                allow='xr-spatial-tracking; fullscreen'
                style={{
                    boxShadow: `0 4px 8px rgb(43 43 43)`,
                    width: "100%",
                    height: "100%",
                    minHeight: window.innerHeight - (window.innerHeight * .30),
                    maxHeight: window.innerHeight - (window.innerHeight * .30)

                }}
            />
        </>
    )
})


export default Frame;
