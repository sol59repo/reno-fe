import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { GetSDK } from '../../Sdk.js';
import shortid from "shortid";
import Helpers from 'app/utils/Helpers.js';
import { useSnackbar } from 'notistack'
import { gestures } from '@composi/gestures'
import { isMobile } from 'react-device-detect';



gestures()

const _applicationKey = process.env.REACT_APP_MATTERPORT_APPLICATION_KEY;

const isFirefox = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf("Firefox") > -1 : false;

let iframe;
let buttonTEST;
let table_container;
let isReady = false;

let tag = null;
let isTagging = false;
let addingTag;
let movingTag;
let container;

const colors = [
    { r: 0.9, g: 0.9, b: 0 }, //yellow
    { r: 0.0, g: 0.0, b: 1.0 }, //blue
    { r: 1, g: 0, b: 0 }, //red
    { r: 0.11, g: 0.40, b: 0.49 }, // purple
    { r: 1, g: 0, b: 0.019 }, // 
    { r: 0.509, g: 0.615, b: 0.6784 }, // 
]


const Frame = forwardRef((props, ref) => {
    const {
        enqueueSnackbar
    } = useSnackbar()

    const {
        _setMpSdk,
        srcEmbed,
        addNewTag,
        addNewMeasurement,
        _tag
    } = props

    const _helpers = Helpers();
    const [mpSdk, setMpSdk] = useState();
    const iframeRef = useRef(null);

    useEffect(() => {
        _getsdk();
    }, [iframeRef]);

    // console.log('navigator.platform)', navigator);

    const _getsdk = async () => {
        let mpSdk = await GetSDK(iframeRef.current, _applicationKey);
        setTimeout(() => {
            setMpSdk(mpSdk);
            _setMpSdk(mpSdk);
            _onSdkConnect(mpSdk);
        }, 600);
    }

    const _onSdkConnect = async (mpSdk) => {


        console.log('isFirefox', isFirefox);

        if (!isFirefox) {
            _focusDetect(mpSdk);
        }

        container = document.querySelector('.showcase_container');
        table_container = document.querySelector(".scrollable");
        iframe = document.querySelector('.ticket-showcase-iframe');
        buttonTEST = document.getElementById('buttonTEST');

        mpSdk.Measurements.data.subscribe({
            onAdded: function (index, item, collection) {
                if (isReady) {
                    enqueueSnackbar(`You can only add measurements in Measurement tab.!`, { variant: 'error' });
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
                    // console.log(intersectionData.position, intersectionData.normal);
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


    function touchstart(ev) {
        //handle the touchstart context menu
        ev.preventDefault();

        alert("inside start method! longpress is working");
        alert(JSON.stringify(document.activeElement));
    }

    function _focusDetect(mpSdk) {
        console.log('document.body', document);

        if ('ontouchstart' in document.body) {
            alert('ontouchstart mobile');
            // if (document.activeElement === iframe) {
            alert('ontouchstart inside iframe');
            window.addEventListener('touchstart', touchstart, {
                once: true,
            });
            // }
        } else {
            const eventListener = window.addEventListener('blur', function () {
                console.log('document.activeElement', document.activeElement);
                if (document.activeElement === iframe) {
                    console.log('_focusDetect 11');
                    _placeTag(mpSdk); //function you want to call on click
                    setTimeout(function () { window.focus(); }, 0);
                }
                window.removeEventListener('blur', eventListener);
            });


            // window.addEventListener('longtap', e => {
            //     console.log('You just long tapped.')

            //     alert('You just long tapped.');
            // })

            // window.addEventListener('dbltap', e => {
            //     console.log('You just double tapped.')
            // })
        }
    }

    const _overlayDetect = (mpSdk) => {
        console.log('_overlayDetect---1', tag);
        // alert('_overlayDetect 2 mobile testing 1')
        if (tag) {
            console.log('_overlayDetect 2 mobile testing 2 with tag')
            const overlay = document.createElement('div');
            overlay.setAttribute('class', 'click-overlay');
            overlay.addEventListener('mousemove', e => {
                console.log('_overlayDetect 2 mobile testing 2 with tag mousemove');
                mpSdk.Renderer.getWorldPositionData({
                    x: e.clientX - 30,
                    y: e.clientY - 5
                })
                    .then(data => {
                        console.log('_overlayDetect 2 mobile testing 2 with tag success',data);
                        _updateTagPos(data.position, undefined, undefined, mpSdk);
                    })
                    .catch(e => {
                        console.error(e);
                        console.log('22');
                        _placeTag(mpSdk);
                    });

            });

            overlay.addEventListener('click', e => {
                console.log('33');
                _placeTag(mpSdk);
                overlay.remove();
            });
            container.insertAdjacentElement('beforeend', overlay);

        }
    }


    const _placeTag = (mpSdk) => {
        if (tag) mpSdk.Mattertag.navigateToTag(tag, mpSdk.Mattertag.Transition.FLY);
        if (tag !== null && tag !== undefined) {
            const refTag = tag;
            mpSdk.Mattertag.getData()
                .then((collection) => {
                    const t_sid = collection.filter(elem => elem.sid == refTag);
                    const refWithId = {
                        refId: new Date().getTime(),
                        status: "Pending"
                    }
                    addNewTag(t_sid, refWithId, mpSdk);
                });
        }

        setTimeout(() => {
            tag = null;
            movingTag = false;
            isTagging = false;
        }, 500)
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
                            // if (isFirefox) _overlayDetect(mpSdk);
                            _overlayDetect(mpSdk);
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
            <button type="button" id='buttonTEST'>Click Me!</button>

            <div className="showcase_container">
                <iframe
                    crossOrigin="true"
                    ref={iframeRef}
                    id='ticket-showcase-iframe'
                    className='ticket-showcase-iframe'
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
            </div>
        </>
    )
})


export default Frame;
