import React, { Component } from 'react'
import NavBar from '../NavBar.jsx'
import {UserContext} from '../user-context';
import { Box, Paper } from '@material-ui/core';
import BetSlip from '../feed/BetSlip.jsx';
import FilterPanel from '../home/FilterPanel.jsx'
import BetsPanel from '../home/BetsPanel.jsx'
import axios from 'axios'
import EditorBetPanel from "./EditorBetPanel"

const URL = "http://localhost:5000/";

const divStyle = {
  height: "calc(90% - 25em)",
  };

const rootBoxStyle = {
    float: "left",
    width: "calc(95% - 25em)",
    marginLeft: "15px",
}

const contests = [
  { name: "Champions League", type:"FOOTBALL" },
  { name: "Premier League", type: "FOOTBALL"},
  { name: "Turkish Super League", type: "FOOTBALL"},
  { name: "Bundesliga", type: "FOOTBALL" },
  { name: "NBA", type: "BASKETBALL"},
  { name: "Euro League", type: "BASKETBALL"}
]

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matches: [],
      inputText: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleBetButton = this.handleBetButton.bind(this)
    this.handleSuggestButton = this.handleSuggestButton.bind(this)
    this.changeInputText = this.changeInputText.bind(this)
    this.resetMatches = this.resetMatches.bind(this)
  }

  changeInputText(text){
    this.setState({
      inputText: text
    })
  }

  handleSuggestButton(betId, matchId, closeFunc, text) {
    console.log("inside suggest button")
    axios.post(URL,
        {
            request_type: "suggest_bet",
            username: this.props.username,
            match_id: matchId,
            bet_id: betId,
            editor_comment: text
          },
        {withCredentials: false})
        .then( res => {
            console.log("result: ", res.data.status)
            closeFunc()
            this.props.updateBetsInfo()
            })
          .catch(error => {
            console.log("login", error);
            });
  }

  handleBetButton(prop1, prop2) {
    console.log("match_id", prop2)
    console.log("id", prop1)
    console.log("username is:", this.props.username)
    axios.post(URL,
      {
          request_type: "add_bet_to_betslip",
          username: this.props.username,
          match_id: prop2,
          bet_id: prop1
        },
      {withCredentials: false})
      .then( res => {
          this.props.updateBetsInfo()
          })
        .catch(error => {
          console.log("login", error);
          });
  }

  resetMatches() {
    this.setState({
      matches: []
    })
  }

    handleSubmit() {
      var sortType = (this.props.filterInfo.sort_type == true ? "popularity" : "")
      var temp = []
      this.setState({
        matches: []
      })
      axios.post(URL,
        {
          "username": "",
          "request_type": "filter",
          "played_amount": "",
          "match_id": "",
          "bet_id": "",
          "editor_comment": "",
          "vote_side": "",
          "filter": {
              "sport_name": this.props.filterInfo.sport,
              "max_mbn": this.props.filterInfo.mbn,
              "contest": this.props.filterInfo.contest,
              "sort_type": "popularity",
              "search_text": this.state.inputText
          }
       })
        .then( res => {
            console.log("result is: ", res.data)
            if (this.props.filterInfo.sport == "FOOTBALL") {
              for (var i = 0; i < res.data.matches.length; i++ ) {
                var match = {home: "", away: "", bets: { mr_one: {},
                                                    mr_draw         : {},
                                                    mr_two          : {},
                                                    over_2_5        : {},
                                                    under_2_5       : {},
                                                    one_one         :{},
                                                    one_zero        :{},
                                                    one_two         :{},
                                                    zero_one        : {},
                                                    zero_zero       : {},
                                                    zero_two        : {},
                                                    two_one         : {},
                                                    two_zero        : {},
                                                    two_two         : {},
                                                    redCardCount_0  :{},
                                                    redCardCount_1  :{},
                                                    cornerCountOver_7_5  :{},
                                                    cornerCountUnder_7_5 :{},
                                              }, match_id: ""};
  
                match.home = res.data.matches[i].bets[0].home_side;
                match.away = res.data.matches[i].bets[0].away_side;
                match.match_id = res.data.matches[i].match_id
                
                for( var j = 0; j < res.data.matches[i].bets.length; j++) {
                  var type = res.data.matches[i].bets[j].bet_type;
                  switch(type) {
                    case "mr_one":
                       match.bets.mr_one = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                        break;
  
                    case "mr_two":
                       match.bets.mr_two = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                        break;
                    case "over_2_5":
                       match.bets.over_2_5 = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                       break;
                    case "under_2_5":
                       match.bets.under_2_5 = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd, 
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                       break;
  
                    case "one_one":
                       match.bets.one_one = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                        break;
  
                    case "one_zero":
                       match.bets.one_two = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                       break;
  
                    case "zero_one":
                       match.bets.zero_one = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                        break;
  
                    case "zero_zero":
                       match.bets.zero_zero = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                        break;
  
                    case "zero_two":
                       match.bets.zero_two = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
  
                    case "two_zero":
                       match.bets.two_zero = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                       break;
  
                    case "two_one":
                       match.bets.two_one = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                       break;
  
                    case "two_two":
                       match.bets.two_two = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                        break;
  
                    case "red_card_count_0":
                       match.bets.redCardCount_0 = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                        break;
  
                    case "red_card_count_1":
                       match.bets.redCardCount_1 = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                       break;
  
                    case "corner_count_over_7_5":
                       match.bets.cornerCountOver_7_5 = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                       break;
  
                    case "corner_count_under_7_5":
                       match.bets.cornerCountUnder_7_5 = { MBN: res.data.matches[i].bets[j].mbn,
                                        odd:res.data.matches[i].bets[j].odd,
                                        oldOdd: res.data.matches[i].bets[j].old_odd,
                                        bet_id: res.data.matches[i].bets[j].bet_id};
                        break;
                    default: break;
                }
              }
              temp[i] = match
            }
          }
          if (this.props.filterInfo.sport == "BASKETBALL") {
            for (var i = 0; i < res.data.matches.length; i++ ) {
              var match = {home: "", away: "", bets: { mr_one: {},
              mr_two          : {},
              reboundOverX    : {},
              reboundUnderX   : {},
              totalScoreOverX: {},
              totalScoreUnderX: {},
              } };
              match.home = res.data.matches[i].bets[0].home_side;
              match.away = res.data.matches[i].bets[0].away_side;
              match.match_id = res.data.matches[i].match_id

              for( var j = 0; j < res.data.matches[i].bets.length; j++) {
                var type = res.data.matches[i].bets[j].bet_type;
                switch(type) {
                  case "mr_one":
                     match.bets.mr_one = { MBN: res.data.matches[i].bets[j].mbn,
                                      odd:res.data.matches[i].bets[j].odd,
                                      oldOdd: res.data.matches[i].bets[j].old_odd,
                                      bet_id: res.data.matches[i].bets[j].bet_id};
                                      
                      break;

                  case "mr_two":
                     match.bets.mr_two = { MBN: res.data.matches[i].bets[j].mbn,
                                      odd:res.data.matches[i].bets[j].odd,
                                      oldOdd: res.data.matches[i].bets[j].old_odd,
                                      bet_id: res.data.matches[i].bets[j].bet_id};
                      break;
                  case "rebound_over_x":
                      match.bets.reboundOverX = {MBN: res.data.matches[i].bets[j].mbn,
                                          odd:res.data.matches[i].bets[j].odd,
                                          oldOdd: res.data.matches[i].bets[j].old_odd,
                                          bet_id: res.data.matches[i].bets[j].bet_id}
                      break;
                  case "rebound_under_x":
                      match.bets.reboundUnderX = {MBN: res.data.matches[i].bets[j].mbn,
                        odd:res.data.matches[i].bets[j].odd,
                        oldOdd: res.data.matches[i].bets[j].old_odd,
                        bet_id: res.data.matches[i].bets[j].bet_id}
                      break;
                  case "total_score_over_x":
                    match.bets.totalScoreOverX = {MBN: res.data.matches[i].bets[j].mbn,
                      odd:res.data.matches[i].bets[j].odd,
                      oldOdd: res.data.matches[i].bets[j].old_odd,
                      bet_id: res.data.matches[i].bets[j].bet_id}
                    break;
                  case "total_score_under_x":
                    match.bets.totalScoreUnderX = {MBN: res.data.matches[i].bets[j].mbn,
                      odd:res.data.matches[i].bets[j].odd,
                      oldOdd: res.data.matches[i].bets[j].old_odd,
                      bet_id: res.data.matches[i].bets[j].bet_id}
                    break;
                  default: break;
              }
            }
            temp[i] = match
            }
          }

          if (this.props.filterInfo.sport == "TENNIS") {
            for (var i = 0; i < res.data.matches.length; i++ ) {
              var match = {home: "", away: "", bets: 
              { mr_one        : {},
              mr_two          : {},
              firstSetHome    : {},
              firstSetAway    : {},
              secondSetHome   : {},
              secondSetAway   : {},
              } };
              match.home = res.data.matches[i].bets[0].home_side;
              match.away = res.data.matches[i].bets[0].away_side;
              match.match_id = res.data.matches[i].match_id

              for( var j = 0; j < res.data.matches[i].bets.length; j++) {
                var type = res.data.matches[i].bets[j].bet_type;
                switch(type) {
                  case "mr_one":
                     match.bets.mr_one = { MBN: res.data.matches[i].bets[j].mbn,
                                      odd:res.data.matches[i].bets[j].odd,
                                      oldOdd: res.data.matches[i].bets[j].old_odd,
                                      bet_id: res.data.matches[i].bets[j].bet_id};
                      break;

                  case "mr_two":
                     match.bets.mr_two = { MBN: res.data.matches[i].bets[j].mbn,
                                      odd:res.data.matches[i].bets[j].odd,
                                      oldOdd: res.data.matches[i].bets[j].old_odd,
                                      bet_id: res.data.matches[i].bets[j].bet_id};
                      break;
                  case "first_set_home":
                      match.bets.firstSetHome = {MBN: res.data.matches[i].bets[j].mbn,
                                          odd:res.data.matches[i].bets[j].odd,
                                          oldOdd: res.data.matches[i].bets[j].old_odd,
                                          bet_id: res.data.matches[i].bets[j].bet_id}
                      break;
                  case "first_set_away":
                      match.bets.firstSetAway = {MBN: res.data.matches[i].bets[j].mbn,
                        odd:res.data.matches[i].bets[j].odd,
                        oldOdd: res.data.matches[i].bets[j].old_odd,
                        bet_id: res.data.matches[i].bets[j].bet_id}
                      break;
                  case "second_set_home":
                    match.bets.secondSetHome = {MBN: res.data.matches[i].bets[j].mbn,
                      odd:res.data.matches[i].bets[j].odd,
                      oldOdd: res.data.matches[i].bets[j].old_odd,
                      bet_id: res.data.matches[i].bets[j].bet_id}
                    break;
                  case "second_set_away":
                    match.bets.secondSetAway = {MBN: res.data.matches[i].bets[j].mbn,
                      odd:res.data.matches[i].bets[j].odd,
                      oldOdd: res.data.matches[i].bets[j].old_odd,
                      bet_id: res.data.matches[i].bets[j].bet_id}
                    break;
                  default: break;
              }
            }
            temp[i] = match
            }
          }

          this.setState({
            matches: temp
          })
        })
         .catch(error => {
            console.log("login", error);
            });
    }

  render() {
    console.log("text", this.state.inputText) 
    return (
    <UserContext.Consumer>
    { ( {username, balance, updateBalance, loggedIn, betsInfo, updateBetsInfo, selectedSport, updateSelectedSport, alphaCoins} ) => (
        <div>
            <NavBar type={this.props.type} userBalance={balance} isLogged={loggedIn} id = {this.props.id} alphaCoins={alphaCoins}/>
            <div style={divStyle}>
              <BetSlip betsInfo = {this.props.betsInfo} updateBetsInfo={updateBetsInfo} id={this.props.id} username={username} type={this.props.type} />
              <Box style={rootBoxStyle}>
                <p>"WELCOME " {this.props.id}</p>
                <FilterPanel inputText={this.state.inputText} onInputChange={this.changeInputText} contests={contests} filterInfo = {this.props.filterInfo} updateFilterInfo = {this.props.updateFilterInfo} updateBetsInfo={updateBetsInfo} handleSubmit={this.handleSubmit} resetMatches = {this.resetMatches} />
                <EditorBetPanel  matches={this.state.matches} betsInfo={betsInfo} selectedSport={this.props.filterInfo.sport} handleBet={this.handleBetButton} handleSuggest={this.handleSuggestButton}/>
            </Box>
           </div>

        </div>
         )}
     </UserContext.Consumer>);
  }
}

export default Home