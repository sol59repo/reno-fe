import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import { Document } from "./ReactPdf";
import { Modal } from "react-bootstrap";
import PageList from "./PageList";
import PdfDocument from "./PdfDocument";
import PdfControls from "./PdfControls";
import "./DocumentPreview.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import "react-pdf/build/annotation_layer_builder.css";

const noop = () => {};

export default class DocumentPreview extends React.PureComponent {
  static propTypes = {
    ...Modal.propTypes,
    fitTo: PropTypes.oneOf(["page", "width"]),
    toolbar: PropTypes.node,
  };
  static defaultProps = {
    fitTo: "page",
    show: false,
    onClose: noop,
  };
  static modalPropTypes = _.keys(Modal.propTypes);
  state = {
    scale: 1,
    loadedPages: {},
  };

  constructor(props) {
    super(props);
    this.state.fitTo = props.fitTo;
    this.state.show = props.show;
  }

  handleDocumentLoaded = ({ numPages: pages }) => {
    this.setState({ page: 1, pages });
  };

  handlePageChange = (page) => this.setState({ page });

  close = () => {
    this.setState({ show: false });
    this.props.onClose();
  };

  render() {
    const { fitTo, scale, pages: pageCount, show } = this.state;

    return (
      <div>
        <PdfDocument
          file={this.props.file}
          scale={scale}
          fitTo={fitTo}
          onLoad={this.handleDocumentLoaded}
          onPageChange={this.handlePageChange}
        />
        <PdfControls
          fitTo={fitTo}
          onZoomToFit={(fitTo) => this.setState({ scale: 1, fitTo })}
          onZoomIn={() => this.setState({ scale: scale * 1.1 })}
          onZoomOut={() => this.setState({ scale: Math.max(0.1, scale * 0.9) })}
        />
      </div>
    );
  }
}
