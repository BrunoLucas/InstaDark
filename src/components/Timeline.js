import React, { Component } from 'react';
import FotoItem from './Foto';

export default class Timeline extends Component {

    constructor() {
        super();
        this.state = { fotos: [] };
    }
    componentDidMount() {
        fetch(`http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`).then(response =>
            response.json().then(fotos => { 
                console.log(fotos);
                this.setState({ fotos: fotos 
                }); }
            )).catch(error => console.log(error));

    }
    render() {
        return (
            <div className="fotos container">
                {this.state.fotos.map(informacoesFoto => <FotoItem foto={informacoesFoto} key={informacoesFoto.id}/>)}}
            </div>
        );
    }
}
