import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';

class FotoAtualizacoes extends Component {

  constructor(props) {
    super(props);
    this.state = { likeada: this.props.foto.likeada };
  }
  like(event) {
    event.preventDefault();

    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({}),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    };

    fetch(`http://localhost:8080/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("não foi possível realizar o like da foto");
        }
      }).then(liker => {
        this.setState({ likeada: !this.state.likeada });
        PubSub.publish("atualiza-liker", { fotoId: this.props.foto.id, liker: liker });
      }).catch(error => {
        console.log(`Erro no like ${error}`);

      })

  }

  render() {
    return (
      <section className="fotoAtualizacoes">
        <a onClick={this.like.bind(this)} className={this.state.likeada ? 'fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'} > Linkar</a>
        <form className="fotoAtualizacoes-form">
          <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" />
          <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
        </form>
      </section>
    );
  }
}

class FotoInfo extends Component {

  constructor(props) {
    super(props);
    this.state = { likers: this.props.foto.likers, mensagemCurtiu: '' };
    this.atualizaMensagemCurtiu(this.props.foto.likers);
  }

  componentWillMount() {
    PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
      if (this.props.foto.id === infoLiker.fotoId) {
        let possivelLike = this.state.likers.find(liker => liker.login === infoLiker.liker.login);
        if (possivelLike === undefined) {
          let novosLikers = this.state.likers.concat(infoLiker.liker);
          this.setState({ likers: novosLikers });
        } else {
          let novaListaDeLikers = this.state.likers.filter(liker => {
            return liker.login !== infoLiker.liker.login
          });
          this.setState({ likers: novaListaDeLikers });
        }
        this.atualizaMensagemCurtiu(this.state.likers);
      }
    });
  }

  atualizaMensagemCurtiu(listaLikers) {
    if (listaLikers.length === 1) {
      this.setState({ mensagemCurtiu: 'curtiu' });
    } else if (listaLikers.length > 1) {
      this.setState({ mensagemCurtiu: 'curtiram' });
    } else {
      this.setState({ mensagemCurtiu: '' });
    }
  }




  render() {
    return (
      <div className="foto-in fo">
        <div className="foto-info-likes">
          {this.state.likers.map(liker => {
            if (this.state.likers.length === 1) {
              return (
                <Link key={liker.login} to={`/timeline/${liker.login}`}>
                  {liker.login}
                </Link>
              )
            } else {
              return (<Link key={liker.login} to={`/timeline/${liker.login}`}>{liker.login},</Link>)
            }
          })}
          <label>{this.state.mensagemCurtiu}</label>
        </div>
        <p className="foto-info-legenda">
          <Link to={`/timeline/${this.props.foto.loginUsuario}`} className="foto-info-autor">{this.props.foto.loginUsuario} </Link>
          {this.props.foto.comentario}
        </p>
        <ul className="foto-info-comentarios">
          {this.props.foto.comentarios.map(comentario => {
            return (
              <li className="comentario">
                <Link key={comentario.text} to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login}</Link>
                {comentario.texto}
              </li>
            )
          })}
        </ul>
      </div>
    );
  }

  textoCurtir(quantidadeLikes) {
    if (quantidadeLikes === 1) {
      return <label>curtiu</label>
    } else if (quantidadeLikes > 1) {
      return <label>curtiram</label>
    }
  }
}

class FotoHeader extends Component {

  render() {
    return (
      <header className="foto-header">
        <figure className="foto-usuario">
          <img src={this.props.foto.urlPerfil} alt="foto do usuario" />
          <figcaption className="foto-usuario">
            <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
              {this.props.foto.loginUsuario}
            </Link>
          </figcaption>
        </figure>
        <time className="foto-data">{this.props.foto.horario}</time>
      </header>
    );
  }
}

export default class FotoItem extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="foto">
        <FotoHeader foto={this.props.foto} />
        <img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
        <FotoInfo foto={this.props.foto} key={this.props.foto.id} />
        <FotoAtualizacoes foto={this.props.foto} />
      </div>
    );
  }
}
