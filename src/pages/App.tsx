import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Place from './Place';

class App extends Component<{}, {}> {
    render() {
        return (
            <Router>
                <Route path="/place" component={Place} />
            </Router>
        );
    }
}

export default App;
