import React, { Component } from 'react';
import FotoItem from './Foto';
import PubSub from 'pubsub-js';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.usuario = this.props.usuario;
    }
    carregarFotos(){

        let urlPerfil = '';
        if(this.usuario === undefined){
            urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        }else{
            urlPerfil = `http://localhost:8080/api/public/fotos/${this.usuario}`;
        }
        fetch(urlPerfil).then(response =>
            response.json().then(fotos => { 
                this.setState({ fotos: fotos 
                }); }
            )).catch(error => console.log(error));
    }
    componentDidMount() {
        this.carregarFotos();
    }

    componentWillMount(){
        PubSub.subscribe('atualiza-timeline', (topico, mensagem)=>{
            console.log(`mensagem ${mensagem}`);
            this.setState({fotos: mensagem});
        });
    }
    componentWillReceiveProps(nextProps ){
        if(nextProps.usuario !== undefined){
            this.usuario = nextProps.usuario;
            this.carregarFotos();
        }
    }
    render() {
        return (
            <div className="fotos container">
                {this.state.fotos.map(informacoesFoto => <FotoItem foto={informacoesFoto} key={informacoesFoto.id}/>)}}
            </div>
        );
    }
}
