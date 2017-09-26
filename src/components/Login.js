import React, { Component } from 'react';
export default class Login extends Component{


    constructor(props){
        super(props);
        this.state = {'mensagemErroLogin' :''};
    }

    timeline(){
        this.props.history.push('/timeline');
    }
    envia(event){
        event.preventDefault();

        const requestInfo = {
            method:'POST',
            body:JSON.stringify({login:this.login.value,senha:this.senha.value}),
            headers: new Headers({
                'Content-type':'application/json'
            })
        };

        this.setState({'mensagemErroLogin' : ''});
        fetch('http://localhost:8080/api/public/login', requestInfo).then(response=>{
            if(response.ok){
               return response.text();
            }else{
                throw new Error('Não foi possível realizar o login');
                
            }
        }).then(token =>{
            localStorage.setItem('auth-token' ,  token);
            this.timeline('/timeline');
        })
        .catch(error =>{
            this.setState({'mensagemErroLogin' : error.message})
            });
    }

    render(){

        return (
            <div className="login-box">
                <h1 className="header-logo">InstaDark</h1>
                <span>{this.state.mensagemErroLogin}</span>
                <form onSubmit={this.envia.bind(this)}>
                    <input type="text" ref={(input)=> this.login = input}/>
                    <input type="password" ref = { (input) => this.senha = input}/>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        )
    }
}
