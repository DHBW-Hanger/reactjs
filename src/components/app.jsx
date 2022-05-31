import React, {useState} from 'react';
import '../css/index.css';

import {
  f7,
  f7ready,
  App,
  // Panel,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListInput,
  ListButton,
  BlockFooter,
} from 'framework7-react';


import routes from '../js/routes';
import store from '../js/store';
import setup from '../js/wikipediaCall';

const MyApp = () => {
  // Login screen demo data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Framework7 Parameters
  const f7params = {
    name: 'Loco', // App name
    theme: 'auto', // Automatic theme detection
    // App store
    store: store,
    // App routes
    routes: routes,
    // Register service worker (only on production build)
    serviceWorker: process.env.NODE_ENV === 'production' ? {
      path: '/service-worker.js',
    } : {},
  };
  const alertLoginData = () => {
    f7.dialog.alert('Username: ' + username + '<br>Password: ' + password, () => {
      f7.loginScreen.close();
    });
  };
  f7ready(() => {
    // Call F7 APIs here
  });

  return (
    <App {...f7params}>
      {/* Views/Tabs container */}
      <Views tabs className="safe-areas" color="pink">
        {/* Tabbar for switching views-tabs */}
        <Toolbar tabbar labels bottom>
          <Link tabLink="#view-catalog" iconIos="f7:star" color="pink" iconAurora="f7:star" iconMd="material:star"
            text="Favoriten"/>
          <Link tabLink="#view-home" tabLinkActive iconIos="f7:house" color="pink" iconAurora="f7:house"
            iconMd="material:house" text="Home"/>
          <Link tabLink="#view-settings" iconIos="f7:search" color="pink" iconAurora="search" iconMd="material:search"
            text="Suchen"/>
        </Toolbar>

        {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */}
        <View id="view-home" main tab tabActive url="/"/>

        {/* Catalog View */}
        <View id="view-catalog" name="catalog" tab url="/catalog/"/>

        {/* Settings View */}
        <View id="view-settings" name="settings" tab url="/settings/"/>

      </Views>

      {/* Popup */}
      <Popup id="my-popup">
        <View>
          <Page>
            <Navbar title="Popup">
              <NavRight>
                <Link popupClose>Close</Link>
              </NavRight>
            </Navbar>
            <Block>
              <p>Popup content goes here.</p>
            </Block>
          </Page>
        </View>
      </Popup>

      <LoginScreen id="my-login-screen">
        <View>
          <Page loginScreen>
            <LoginScreenTitle>Login</LoginScreenTitle>
            <List form>
              <ListInput
                type="text"
                name="username"
                placeholder="Your username"
                value={username}
                onInput={(e) => setUsername(e.target.value)}
              ></ListInput>
              <ListInput
                type="password"
                name="password"
                placeholder="Your password"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
              ></ListInput>
            </List>
            <List>
              <ListButton title="Sign In" onClick={() => alertLoginData()}/>
              <BlockFooter>
                Some text about login information.<br/>Click &quot;Sign In&quot; to close Login Screen
              </BlockFooter>
            </List>
          </Page>
        </View>
      </LoginScreen>
    </App>
  );
};
export default MyApp;
