import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ParticlesBg from 'particles-bg';
import { Stack, createTheme } from '@material-ui/core';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
// import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
// import { LOGOUT } from './actions/types';

// Redux
import { Provider } from 'react-redux';
import store from './store';
// import './curtain.scss';
import './App.css';
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
  typography: {
    fontFamily: "Rajdhani, sans-serif",
    fontSize: 16,
  },
  components: {
    Button: {

      fontFamily: "Poppins, sans-serif",
      fontSize: '1rem',
    }
  }
});

const App = () => {
  // useEffect(() => {
  //   // check for token in LS
  //   if (localStorage.token) {
  //     setAuthToken(localStorage.token);
  //   }
  //   store.dispatch(loadUser());

  //   // log user out from all tabs if they log out in one tab
  //   window.addEventListener('storage', () => {
  //     if (!localStorage.token) store.dispatch({ type: LOGOUT });
  //   });
  // }, []);
  const closeNav = () => {
    document.getElementById('myNav_left').style.left = '-100%';
    document.getElementById('myNav_right').style.right = '-100%';
  }

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <ThemeProvider theme={theme}>
            <Stack direction='row' id="myNav_left" className="overlay_left" justifyContent='flex-end' alignItems='center' onClick={closeNav}>
              <h1>Ryoshi Vision&nbsp;</h1>
              <img src="/img/ryo_left.png" style={{ width: '20%' }} alt="splash"/>
            </Stack>
            <Stack direction='row' id="myNav_right" className="overlay_right" justifyContent='flex-start' alignItems='center' onClick={closeNav}>
              <img src="/img/ryo_right.png" style={{ width: '20%' }} alt="splach"/>
              <h1>Concerts Presents</h1>
            </Stack>
            <div className='bubbles'>
              <ParticlesBg type="circle" num={10} color="#2b2d42" bg={true} />
            </div>
            <Navbar className='my-comp' />
            <Switch>
              {/* <Route exact path="/" component={Landing} /> */}
              <Route component={Routes} />
            </Switch>
            <Footer />
          </ThemeProvider>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
