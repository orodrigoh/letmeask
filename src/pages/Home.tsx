import Illustration from "../assets/images/illustration.svg";
import Logo from "../assets/images/logo.svg";
import Google from "../assets/images/google-icon.svg";
import "../styles/auth.scss";
import { Button } from '../components/Button';
import { useHistory } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";



export function Home() {
  const history = useHistory();
  const {user,signInWithGoogle} = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    //Retornando para campo vazio
    if (roomCode.trim() === '') {
      return;
    }
    
    //verificando se o caminho existe dentro da database
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exist.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return
    }

    history.push(`rooms/${roomCode}`);
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
          <button onClick={handleCreateRoom} className="create-room">
            <img src={Google} alt="Ícone Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={({target}) => setRoomCode(target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}