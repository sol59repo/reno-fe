import React from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, List } from 'react-virtualized';
import Waypoint from 'react-waypoint';
import { Page } from './ReactPdf';
import './PageList.css';

const EXPERIMENTAL_VIRTUALIZED = false;
const noop = () => {};

export default class PageList extends React.PureComponent {
    static propTypes = {
        fitTo: PropTypes.oneOf(['page', 'width']),
        scale: PropTypes.number,
        pageCount: PropTypes.number,
        pages: PropTypes.object,
        onPageChange: PropTypes.func
    };
    static defaultProps = {
        onPageChange: noop
    };
    state = {
        pages: {}
    };
    handleWaypointEnter = page => {
        page && this.props.onPageChange(page.pageIndex + 1);
    };
    renderPage = ({
        index, // Index of row
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        key, // Unique key within array of rendered rows
        parent, // Reference to the parent List (instance)
        style // Style object to be applied to row (to position it); This must be passed through to the rendered row element.
    }) => {
        const { pages } = this.state;
        return (
            <Waypoint
                topOffset="50%"
                bottomOffset="49%"
                onEnter={this.handleWaypointEnter.bind(this, pages[index])}
                key={key}
            >
                <div>
                    <Page
                        {...this.props}
                        style={style}
                        scale={this.calculateScale(pages[index])}
                        pageNumber={index + 1}
                        onLoadSuccess={page =>
                            this.setState({
                                pages: { ...pages, [page.pageIndex]: page }
                            })
                        }
                    />
                </div>
            </Waypoint>
        );
    };

    calculateScale = page => {
        const { fitTo, scale: globalScale, container } = this.props;
        if (!page || !container) {
            return globalScale;
        }
        const pageScale = page.scale || 1;
        const { clientWidth, clientHeight } = container;

        const rotated =
            page.pageInfo.rotate === 90 || page.pageInfo.rotate === 270;
        const pageWidth = rotated ? page.originalHeight : page.originalWidth;
        const pageHeight = rotated ? page.originalWidth : page.originalHeight;
        const scaleX = clientWidth / pageWidth;
        const scaleY = clientHeight / pageHeight;
        if (fitTo === 'page') {
            return globalScale * Math.min(scaleX, scaleY);
        }
        if (fitTo === 'width') {
            return globalScale * scaleX;
        }
        return globalScale * pageScale;
    };
    componentWillReceiveProps = nextProps => {
        if (
            EXPERIMENTAL_VIRTUALIZED &&
            this.list &&
            nextProps.scale !== this.props.scale
        ) {
            this.list.forceUpdateGrid();
        }
    };
    render() {
        const { pageCount } = this.props;
        if (EXPERIMENTAL_VIRTUALIZED) {
            return (
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={list => (this.list = list)}
                            height={height}
                            width={width}
                            rowCount={pageCount}
                            rowHeight={720}
                            rowRenderer={this.renderPage}
                            overscanRowCount={2}
                        />
                    )}
                </AutoSizer>
            );
        }
        return (
            <div className="page-list">
                {[...Array(this.props.pageCount).keys()].map(index =>
                    this.renderPage({
                        index,
                        key: `page-${index}`
                    })
                )}
            </div>
        );
    }
}
