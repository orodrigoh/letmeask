import Illustration from "../assets/images/illustration.svg";
import Logo from "../assets/images/logo.svg";
import "../styles/auth.scss";
import { Button } from '../components/Button';
import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react'
import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

export const NewRoom = () => {
  const [room, setRoom] = useState('');
  const { user } = useAuth();
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault(); 
    //verificando se existe nome na sala
    if (room.trim() === '') {
      return;
    }

    //Criando uma categoria dentro da base de dados
    const roomRef = database.ref('rooms')

    //Jogando as informações para dentro de 'rooms' na database.
    const firebaseRoom = await roomRef.push({
      title: room,
      authorId: user?.id,
    });
    //Enviando usuário para sala criada
    history.push(`/admin/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={Illustration} alt="Ilustração de perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main >
        <div className="main-content">
          <img src={Logo} alt="Logo Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={({target}) => setRoom(target.value)}
              value={room}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala já existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}
