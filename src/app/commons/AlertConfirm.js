/**
 * @desc - Defines a custom Swal component
 * @param - string title
 * @param - string text
 * @param - string icon
 * @param - string confirmButtonText
 * @param - string showCancelButton
 * @return - no return, callback only after the promise
 * @author - Gevie l. Pitogo
 **/

import Swal from "sweetalert2";

const AlertConfirm = (props) => {
  if (props === undefined) {
    alert("please add params for SWAL");
    return;
  }

  const { showCloseButton, showCancelButton, callback, ...restOfProps } = props;

  Swal.fire({
    ...restOfProps,
    showCloseButton: showCloseButton,
    showCancelButton: showCancelButton,
  }).then((result) => {
    if (result.value) {
      callback();
    }
  });
};

export default AlertConfirm;

AlertConfirm.defaultProps = {
  showCloseButton: true,
  showCancelButton: true,
  callback: () => {},
};
