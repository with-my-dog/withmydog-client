import React, { Component } from 'react';
import { List } from '../internal';

import Map from '../components/Map';

declare const daum: any;

export default class MapContainer extends Component<{}, {}> {
    componentDidMount() {
        this.initializeMap();
    }

    private initializeMap = (): void => {
        const mapEl = document.getElementById('mapEl');
        const mapOptions = {
            center: new daum.maps.LatLng(37.552617, 126.904614),
            level: 3,
        };
        const daumMap = new daum.maps.Map(mapEl, mapOptions);
    };

    render() {
        // return <Map />;
        return <List />;
    }
}
