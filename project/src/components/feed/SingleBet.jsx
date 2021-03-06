import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import {UserContext} from '../user-context';
import Paper from '@material-ui/core/Paper';

const divStyle = {
  height: "8em",
  overflowY: "hidden",
  };

class SingleBet extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
        <div style={divStyle}>
          <Paper elevation={3}>
            <p>{this.props.matchname}</p>
            <p>Bet type: {this.props.type}</p>
            <p>Odd: {this.props.odd}  MBN: {this.props.mbn}</p>
          </Paper>
        </div>
         )
  }
}

export default SingleBet