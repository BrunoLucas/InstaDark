import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import App from './App';
import Login from './components/Login';
import registerServiceWorker from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Route, Redirect
} from 'react-router-dom';

function verificaSeNaoEstaAutenticado(nextState, replace) {
    if (localStorage.getItem('auth-token') == null) {
        return true;
    }
    return false;

}
function removeToken() {
    localStorage.removeItem('auth-token');
    return true;
}

ReactDOM.render(
    (
        <Router>
            <div>

                <Route exact path="/" render={() => (
                    verificaSeNaoEstaAutenticado() ? (
                        <Redirect to="/login" />
                    ) : (
                            <App />
                        )
                )} />

                <Route path="/login" component={Login} />
                <Route exact path="/timeline" render={() => (
                    verificaSeNaoEstaAutenticado() ? (
                        <Redirect to="/login" mensagemErroLogin="você precisa estar logado para acessar o endereço" />
                    ) : (
                            <App />
                        )
                )} />

        
        
        
                <Route exact path="/timeline/:usuario" render={(props) => {
                console.log('aqui estou ' + props);    
                return (
                    verificaSeNaoEstaAutenticado() ? (
                        <Redirect to="/login" mensagemErroLogin="você precisa estar logado para acessar o endereço" />
                    ) : (
                            <App {...props}/>
                        )
                )
                }
            } />
                <Route exact path="/logout" render={() => (
                    removeToken() ? (
                        <Redirect to="/login" />
                    ) : <App />
                )} />
            </div>


        </Router>
    ),
    document.getElementById('root'));
registerServiceWorker();
