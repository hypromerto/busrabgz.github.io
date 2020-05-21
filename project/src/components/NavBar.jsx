import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from 'axios';
const URL = "http://localhost:5000/profile";

const root = {
  flexGrow: 1,
}

const menuButton = {
  marginRight: "10px",
}

const title = {
  flexGrow: 0.1,
  marginRight: "5px",
}

const box = {
  maxHeight: 100,
  marginLeft: "20px",
}

const listItemText = {
  fontSize: '0.8em',
}

const logoutButton = {
  marginRight: 50,
}

const buttonGroup = {
  marginLeft: "30px",
}

class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      balance: 0,
      alphaCoins: 0,
      type: this.props.type,
    }
  }
  componentDidMount() {
    if (this.props.id != -1) {
      axios.post(URL,
        {
            "request_type": "get_user_info",
            "user_id": this.props.id
         },
        {withCredentials: false})
        .then( res => {
              this.setState({balance: res.data.result.account_balance, alphaCoins: res.data.result.alpha_coins
              })
            })
         .catch(error => {
            console.log("info", error);
            });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userBalance != this.props.userBalance) {
      if (this.props.id != -1) {
        axios.post(URL,
          {
              "request_type": "get_user_info",
              "user_id": this.props.id
           },
          {withCredentials: false})
          .then( res => {
              this.setState({balance: res.data.result.account_balance,
                })
              })
           .catch(error => {
              console.log("info", error);
              });
      }
    }
    if (prevProps.alphaCoins != this.props.alphaCoins) {
      if (this.props.id != -1) {
        axios.post(URL,
          {
              "request_type": "get_user_info",
              "user_id": this.props.id
           },
          {withCredentials: false})
          .then( res => {
              this.setState({alphaCoins: res.data.result.alpha_coins,
                })
              })
           .catch(error => {
              console.log("info", error);
              });
      }
    }
  }
  
  render() {  
    switch(this.state.type){
      case "admin":
        var navbar =  
        <AppBar style={{width: "100%"}} position="static">
            <Toolbar style={{width: "100%"}}>
              <Typography variant="h4" style={title}>AlphaBet</Typography>
              <Link style={{textDecoration: 'none'}} to="/dashboard"><Button variant="contained" color="white">Dashboard</Button></Link> 
              <Typography variant="h6" style={{flexGrow: 1,}}>
              </Typography>
              <Button style={logoutButton} size="small" variant="contained" color="secondary">Logout</Button>
            </Toolbar>  
          </AppBar>
          break;

        case "editor":
          var navbar = 
          <AppBar position="static">
          <Toolbar>
            <Typography variant="h4" style={title}>AlphaBet</Typography>
              <Link style={{textDecoration: 'none'}} to='/editorHome'><Button variant="contained" color="white">Home</Button></Link>
              <Typography variant="h6" style={{flexGrow: 1,}}></Typography>
              <Button style={logoutButton} size="small" variant="contained" color="secondary">Logout</Button>
          </Toolbar>
        </AppBar>
        break;

      case "user":
        var navbar = 
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4" style={title}>AlphaBet</Typography>
            <Link style={{textDecoration: 'none'}} to='/'><Button variant="contained" color="white">Home</Button></Link>
            <Link style={{textDecoration: 'none'}} to="/profile"><Button variant="contained" color="white">Profile</Button></Link>
            <Link style={{textDecoration: 'none'}} to="/editors"><Button  variant="contained"color="white">Editors</Button></Link>
            <Link style={{textDecoration: 'none'}} to="/feed"><Button variant="contained" color="white">Feed</Button></Link>
            <Link style={{textDecoration: 'none'}} to="/market"><Button variant="contained" style = {menuButton} color="white"> Market</Button></Link>
            <Typography variant="h6" style={{flexGrow: 1,}}></Typography>
            <Box style={box} my={-5}>
              <List component="nav">
                <Box mb={-2}><ListItem>
                  <ListItemText style = {listItemText} primary={"Balance: " + this.state.balance}></ListItemText>
                </ListItem></Box>
                <Box mt={-1}><ListItem>
                  <ListItemText style = {listItemText} primary={"AlphaCoins: " + this.state.alphaCoins}></ListItemText>
                </ListItem></Box>
              </List></Box>
              <Button style={logoutButton} size="small" variant="contained" color="secondary">Logout</Button>
          </Toolbar>
        </AppBar>
        break;

      default:
        var navbar = 
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4" style={title}>AlphaBet</Typography>
            <Link style={{textDecoration: 'none'}} to='/'><Button variant="contained" color="white">Home</Button></Link>
            <Link style={{textDecoration: 'none'}} to="/editors"><Button variant="contained" color="white">Editors</Button></Link>
            <Typography variant="h6" style={{flexGrow: 1,}}></Typography>
            <ButtonGroup color="primary" aria-label="outlined primary button group" style={buttonGroup}>
              <Link to='/register' style={{textDecoration: 'none'}}>
                <Button size="small" variant="contained" color="secondary" >Register</Button>
              </Link>
              <Link to='/signin' style={{textDecoration: 'none'}}>
                <Button size="small" variant="contained" color="secondary">Login</Button>
              </Link>
            </ButtonGroup>
          </Toolbar>
        </AppBar>
        break;
    }
    return(navbar);
  }
}

export default NavBar
