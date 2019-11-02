import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import {
    Map,
    selectMarkerAction,
    getStoresAction,
    RootState,
    StoreType,
    Store,
    GeoLocationBoundary,
} from '../internal';

const debounce = require('lodash/debounce');
const myLocationMarker = require('../assets/images/markers/my-location.svg');

declare const daum: any;

const updateMyPositionDelay = 5000;

const MapWrapper = styled.div`
    height: 90%;
`;

interface Props {
    selectedMarker?: string;
    stores: Store[];
    selectMarkerAction?(markerId: string): void;
    getStoresAction?(GeoLocationBoundary: GeoLocationBoundary): void;
}

class MapContainerComp extends Component<Props, {}> {
    mapCluster: any;
    // map: any;
    myLoaction: any;
    myLocationMarker: any;
    updateLocationInterval!: number;
    
    componentDidMount() {
        this.initializeMap();
        
        this.updateLocationInterval = setInterval(() => {
            this.drawMyPosition();
        }, updateMyPositionDelay);
    }

    componentWillUnmount() {
        clearInterval(this.updateLocationInterval);
    }

    componentWillReceiveProps(nextProps: Props, nextState: {}) {
        //
    }

    componentDidUpdate(prevProps: Props) {
        this.updateStore(this.props.stores);
    }

    private initializeMap = (): void => {
        const mapEl = document.getElementById('mapEl');
        const mapOptions = {
            center: new daum.maps.LatLng(37.552617, 126.904614),
            level: 3,
        };
        const map = new daum.maps.Map(mapEl, mapOptions);
        daum.maps.event.addListener(map, 'bounds_changed', this.debouncedBoundsChanged);
        this.mapCluster = new daum.maps.MarkerClusterer({
            map: map,
            markers: [],
            minLevel: 10,
        })
    };

    // debounce 적용된 새로운 맵 바운더리 정보
    private debouncedBoundsChanged = debounce((): void => {
        // 지도의 bounds 기준은 남서쪽, 동북쪽
        const newBounds = this.mapCluster.getMap().getBounds();
        console.log('bounds', newBounds.toString());
        console.log('SouthWest', newBounds.getSouthWest().getLat(), newBounds.getSouthWest().getLng());
        console.log('NorthEast', newBounds.getNorthEast().getLat(), newBounds.getNorthEast().getLng());
        const sw = {
            Lat: newBounds.getSouthWest().getLat(),
            Lng: newBounds.getSouthWest().getLng(),
        }
        const ne = {
            Lat: newBounds.getSouthWest().getLat(),
            Lng: newBounds.getSouthWest().getLng(),
        }
        if (this.props.getStoresAction) {
            this.props.getStoresAction({sw, ne});
        }
    }, 200);

    private updateStore = (storeData: Store[]) => {
        this.mapCluster.clear();
        const storeMarkers = this.getMarkers(storeData);
        this.mapCluster.addMarkers(storeMarkers);
    }

    private getMarkerImage = (storeData: Store) => {
        const {type, canBigDog} = storeData;
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

    private getMarkers = (markerList: Store[]): any[] => {
        const markers: any[] = [];
        for( const markerData of markerList ) {
            const markerSize = this.getMarkerSize(markerData.canBigDog);
            const markerImgSize = new daum.maps.Size(markerSize.width, markerSize.height);
            const markerImg = new daum.maps.MarkerImage(this.getMarkerImage(markerData), markerImgSize);
            const markerPosition = new daum.maps.LatLng(markerData.position.Lat, markerData.position.Lng);
            const marker = new daum.maps.Marker({
                position: markerPosition,
                image: markerImg,
            });
            // marker.setMap(this.map);
            markers.push(marker);
            const onMarkerClickHandler = () => {
                // 여기서, 데이터 가져오는 액션 호출
                console.log('clicked marker type is: ', markerData.type);
                if (this.props.selectMarkerAction) {
                    this.props.selectMarkerAction(`${markerData.id}`);
                }
            }
            daum.maps.event.addListener(marker, 'click', onMarkerClickHandler);
        }
        return markers;
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
            // this.myLocationMarker.setMap(this.map);
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
    }
}

function mapStateToProps(state: RootState): Props {
    return {
        selectedMarker: state.mapReducer.selectedMarker,
        stores: state.mapReducer.stores,
    }
}
function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({
        selectMarkerAction: selectMarkerAction,
        getStoresAction: getStoresAction,
    }, dispatch)
}

export const MapContainer = connect(mapStateToProps, mapDispatchToProps)(MapContainerComp);