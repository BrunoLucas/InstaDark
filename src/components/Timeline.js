import React, { Component } from 'react';
import FotoItem from './Foto';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.usuario = this.props.usuario;
    }
    carregarFotos() {

        let urlPerfil = '';
        if (this.usuario === undefined) {
            urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `http://localhost:8080/api/public/fotos/${this.usuario}`;
        }
        fetch(urlPerfil).then(response =>
            response.json().then(fotos => {
                this.setState({
                    fotos: fotos
                });
            }

            )).catch(error => console.log(error));

    }



    componentDidMount() {
        this.carregarFotos();
    }

    componentWillMount() {
        PubSub.subscribe('atualiza-timeline', (topico, mensagem) => {
            console.log(`mensagem ${mensagem}`);
            this.setState({ fotos: mensagem });
        });

        PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
            let fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId);
            fotoAchada.likeada = !fotoAchada.likeada;
            let possivelLike = fotoAchada.likers.find(liker => liker.login === infoLiker.liker.login);
            if (possivelLike === undefined) {
                fotoAchada.likers.push(infoLiker.liker);
            } else {
                let novosLikers = [];
                novosLikers = fotoAchada.likers.filter(liker => {
                    return liker.login !== infoLiker.liker.login
                });
                fotoAchada.likers = novosLikers;

            }
            this.setState({ fotos: this.state.fotos });
        });


        PubSub.subscribe('atualiza-comentarios', (topico, infoComentario) => {

            const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);
            fotoAchada.comentarios.push(infoComentario.novoComentario);
            this.setState({ fotos: this.state.fotos });

        });
    }

    mensagemDeCurtir(listaDeLikers) {
        if (listaDeLikers === undefined) {
            return '';
        } else if (listaDeLikers === 1) {
            return 'curtiu';
        } else {
            return 'curtiram';
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.usuario !== undefined) {
            this.usuario = nextProps.usuario;
            this.carregarFotos();
        }
    }

    comenta(fotoId, comentario) {
        let requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: comentario }),
            headers: new Headers({ 'Content-Type': 'application/json' })
        };

        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('Erro ao realizar comentario da foto');
                }
            }).then(comentario => {
                PubSub.publish('atualiza-comentarios', { fotoId: fotoId, comentario: comentario });
            }).catch(error => {
                throw new Error(error);
            });

    }

    like(fotoId) {

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({}),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("não foi possível realizar o like da foto");
                }
            }).then(liker => {
                PubSub.publish("atualiza-liker", { fotoId: fotoId, liker: liker });
            }).catch(error => {
                console.log(`Erro no like ${error}`);
            })

    }
    render() {
        return (

            <ReactCSSTransitionGroup
                transitionName="timeline"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                <div className="fotos container">

                    {
                        this.state.fotos.map(informacoesFoto => {
                            return (
                                <FotoItem foto={informacoesFoto}
                                    key={informacoesFoto.id}
                                    like={this.like}
                                    comenta={this.comenta} />
                            )
                        }

                        )
                    }

                </div>

            </ReactCSSTransitionGroup>
        );
    }
}
