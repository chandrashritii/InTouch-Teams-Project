import React, { useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Col, Grid, Row } from 'rsuite';
import { UserRooms } from '../../context/rooms.context';
import { useMediaQuery } from '../../configs/functional';
import Navbar from '../Navbar/Navbar';
import Chat from './Chat';
import "../../styles/main.scss";
import teams from '../../assets/teams.svg';


const Home = () => {
  const isDesktop = useMediaQuery('(min-width:992px)');
  const { isExact } = useRouteMatch();

  const canRenderNavbar = isDesktop || isExact;
  return (
    <UserRooms>
      <Grid fluid className="heighthundred">
        <Row className="heighthundred">
          {canRenderNavbar && (
            <Col xs={17} md={8} className="heighthundred">
              <Navbar />
            </Col>
          )}

          <Switch>
            <Route exact path="/chat/:chatId">
              <Col xs={24} md={16} className="heighthundred">
                <Chat />
              </Col>
            </Route>
            <Route>
            {/* if no room is selected */}
              {isDesktop && (
                <Col xs={24} md={16} className="heighthundred bg">
                  <img src={teams} style={{width: '50px', height: '50px', marginTop:'18px', alignItems: 'center'}}/>
                  <div style={{marginBottom:'25px'}}>
                  <h2>Stay.InTouch</h2>
                  <h6 class="rainbow-text">  
                  <br />We hope you brought pizza 
                </h6> 
                </div>
                </Col>
              )}
            </Route>
          </Switch>
        </Row>
      </Grid>
    </UserRooms>
  );
};

export default Home;