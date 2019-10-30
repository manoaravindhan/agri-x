/* eslint-disable import/no-named-as-default */
import React from "react";
import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';
import Map from "./Map";
import MainType from './MainType';
import SubType from './SubType';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      MainTypeId: 1
    }
  }
  onMainTypeChange = MainTypeId => {
    this.setState({MainTypeId})
  }
  render() {
    const {MainTypeId} = this.state;
    return (
      <Grid container>
        <Grid item md={2}>
            <MainType handleChange={this.onMainTypeChange}/>
        </Grid>
        <Grid item md={10}>
          <Map />
        </Grid>
        <Grid item md={12}>
          <SubType mainType={MainTypeId}/>
        </Grid>
      </Grid>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;
