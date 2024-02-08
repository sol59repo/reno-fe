export function GetSDK(iframe, applicationKey) {
    return new Promise ((resolve, reject)=>{
        // const iframe = document.getElementById('showcase-iframe');

        console.log('iframe',iframe);
        console.log('applicationKey',applicationKey);
        
        iframe.addEventListener('load', async function () {
            try {

                // const sdk = await (iframe.contentWindow as any).MP_SDK.connect(iframe, applicationKey, '3.5');
                const sdk = await window.MP_SDK.connect(
                    iframe, // Obtained earlier
                    applicationKey, // Your SDK key
                    '' // Unused but needs to be a valid string
                );
                resolve(sdk);
            } catch (e) {
                resolve(e);
            }
        });
    });
  }
  


  // export const GetSDK = function(elementId: string|HTMLIFrameElement, applicationKey: string): Promise<any> {
  //   return new Promise(function(resolve, reject) {
  //     const checkIframe = async function() {
  //       var iframe = null;

  //       if (elementId instanceof HTMLIFrameElement) {
  //         iframe = elementId as HTMLIFrameElement;
  //       }
  //       else {
  //         iframe = document.getElementById(elementId);
  //       }
  //       if (iframe && (iframe as any).contentWindow.MP_SDK) {
  //         clearInterval(intervalId);
  //       //   console.log('intervalId',intervalId);
  //         const sdk = await (iframe as any).contentWindow.MP_SDK.connect(iframe, applicationKey, '2.1');
  //         resolve(sdk);
  //       }
  //     };
  //     const intervalId = setInterval(checkIframe, 200);

  //   //   console.log('intervalId222222',intervalId);
      
  //   });
  // }
  