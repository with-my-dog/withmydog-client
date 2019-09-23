import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';

import {
    Map,
    selectMarkerAction,
    RootState,
} from '../internal';

const debounce = require('lodash/debounce');

const myLocationMarker = require('../assets/images/markers/my-location.svg');

declare const daum: any;

interface LatLng {
    Lat: number;
    Lng: number;
}

enum StoreType {
    cafe = 'CAFE',
    restaurant = 'RESTAURANT',
    pub = 'PUB',
}

interface Marker {
    id: string;
    type: StoreType;
    position: LatLng;
    canBigDog?: boolean;
}

const MapWrapper = styled.div`
    height: 90%;
`;

const dummyMarkerList = [
    {
        id: '1',
        type: StoreType.cafe,
        position: {
            Lat: 37.552617, Lng: 126.904614
        }
    },
    {
        id: '2',
        type: StoreType.restaurant,
        position: {
            Lat: 37.553617, Lng: 126.905614
        },
        canBigDog: true,
    },
    {
        id: '3',
        type: StoreType.pub,
        position: {
            Lat: 37.551617, Lng: 126.903614
        }
    },
    {
        id: '4',
        type: StoreType.cafe,
        position: {
            Lat: 37.551617, Lng: 126.903614
        }
    },
]

interface Props {
    selectedMarker?: string;
    selectMarkerAction?(markerId: string): void;
}

class MapContainerComp extends Component<Props, {}> {
    map: any;
    myLoaction: any;
    myLocationMarker: any;
    updateLocationInterval!: number;

    componentDidMount() {
        this.initializeMap();
        this.updateLocationInterval = setInterval(() => {
            this.drawMyPosition();
        }, 5000);
        console.log('props', this.props);
    }

    componentWillUnmount() {
        clearInterval(this.updateLocationInterval);
    }

    componentWillReceiveProps(nextProps: Props, nextState: {}) {
        console.log('new props', nextProps.selectedMarker);
    }

    private initializeMap = (): void => {
        const mapEl = document.getElementById('mapEl');
        const mapOptions = {
            center: new daum.maps.LatLng(37.552617, 126.904614),
            level: 3,
        };
        this.map = new daum.maps.Map(mapEl, mapOptions);
        daum.maps.event.addListener(this.map, 'bounds_changed', this.debouncedBoundsChanged);
        this.drawMarkers(dummyMarkerList);
    };

    // debounce 적용된 새로운 맵 바운더리 정보
    private debouncedBoundsChanged = debounce((): void => {
        // 지도의 bounds 기준은 남서쪽, 동북쪽
        const newBounds = this.map.getBounds();
        console.log('bounds', newBounds.toString());
        console.log('SouthWest', newBounds.getSouthWest().getLat(), newBounds.getSouthWest().getLng());
        console.log('NorthEast', newBounds.getNorthEast().getLat(), newBounds.getNorthEast().getLng());
    }, 200);

    private getMarkerImage = (markerData: Marker) => {
        const {type, canBigDog} = markerData;
        let markerImage = 'marker';
        switch(type) {
            case StoreType.cafe:
                // return cafeMarker;
                markerImage += '-cafe';
                break;
            case StoreType.pub:
                // return barMarker;
                markerImage += '-bar';
                break;
            case StoreType.restaurant:
                // return restaurantMarker;
                markerImage += '-restaurant';
                break;
        }
        if (canBigDog) {
            markerImage += '-bigdog'
        }
        markerImage += '.svg';
        return require('../assets/images/markers/' + markerImage);
    }

    private getMarkerSize(canBigDog: boolean | undefined) {
        return canBigDog ? {width: 82, height: 36} : {width: 32, height: 36};
    }

    private drawMarkers = (markerList: Marker[]): void => {
        for( const markerData of markerList ) {
            const markerSize = this.getMarkerSize(markerData.canBigDog);
            const markerImgSize = new daum.maps.Size(markerSize.width, markerSize.height);
            const markerImg = new daum.maps.MarkerImage(this.getMarkerImage(markerData), markerImgSize);
            const markerPosition = new daum.maps.LatLng(markerData.position.Lat, markerData.position.Lng);
            const marker = new daum.maps.Marker({
                position: markerPosition,
                image: markerImg,
            });
            marker.setMap(this.map);
            const onMarkerClickHandler = () => {
                // 여기서, 데이터 가져오는 액션 호출
                console.log('clicked marker type is: ', markerData.type);
                if (this.props.selectMarkerAction) {
                    this.props.selectMarkerAction(`${markerData.id}`);
                }
            }
            daum.maps.event.addListener(marker, 'click', onMarkerClickHandler);
        }
    }

    private drawMyPosition() {
        this.getMyposition();
        if (!this.myLoaction) {
            // this.myLocationMarker = undefined;
            return;
        }
        if (this.myLocationMarker === undefined) {
            const markerImgSize = new daum.maps.Size(40, 40);
            const markerImg = new daum.maps.MarkerImage(myLocationMarker, markerImgSize);
            const markerPosition = new daum.maps.LatLng(this.myLoaction.coords.latitude, this.myLoaction.coords.longitude);
            this.myLocationMarker = new daum.maps.Marker({
                position: markerPosition,
                image: markerImg,
            });
            this.myLocationMarker.setMap(this.map);
        } else {
            this.myLocationMarker.setPosition(new daum.maps.LatLng(this.myLoaction.coords.latitude, this.myLoaction.coords.longitude))
        }
    }

    private getMyposition = () => {
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition((position: Position) => {
                this.myLoaction = position;
            });

        } else { 
            // x.innerHTML = "Geolocation is not supported by this browser.";
            return undefined;
        }
    };

    render() {
        return (
            <>
                <MapWrapper>
                    <Map />
                </MapWrapper>
            </>
        );
        // return <List />;
    }
}

function mapStateToProps(state: RootState): any {
    return {
        selectedMarker: state.mapReducer.selectedMarker,
    }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({
        selectMarkerAction: selectMarkerAction,
    }, dispatch)
}

export const MapContainer = connect(mapStateToProps, mapDispatchToProps)(MapContainerComp);

// private drawMarkers = (markerList: Marker[]): void => {
//     for( const markerData of markerList ) {
//         // const markerImgSize = new daum.maps.Size(40, 40);
//         // const markerImg = new daum.maps.MarkerImage(dummyMarker, markerImgSize);
//         const markerPosition = new daum.maps.LatLng(markerData.position.Lat, markerData.position.Lng);
//         // const marker = new daum.maps.Marker({
//         //     position: markerPosition,
//         //     image: markerImg,
//         // });
//         // marker.setMap(this.map);
//         const markerId = `marker-${markerData.id}`;
//         const content = `
//         <div style="${markerStyle}" id="${markerId}">
//             <img src="${this.getMarkerImage(markerData.type)}" /> test
//         </div>`;
//         const customOverlay = new daum.maps.CustomOverlay({
//             position: markerPosition,
//             content: content   
//         });
//         customOverlay.setMap(this.map);
//         const renderedCustomOverlay = document.getElementById(markerId);
//         const onMarkerClickHandler = () => {
//             // 여기서, 데이터 가져오는 액션 호출
//             console.log('clicked marker type is: ', markerData.type);
//         }
//         if (!!renderedCustomOverlay) {
//             renderedCustomOverlay.addEventListener('click', onMarkerClickHandler);
//         }
//         // daum.maps.event.addListener(marker, 'click', onMarkerClickHandler);
//     }
// }