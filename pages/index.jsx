import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { bg } from '../db.json';

import Widget from '../src/components/Widget';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <Widget>
          <Widget.Header>
            <h1>The legend of Zelda</h1>
          </Widget.Header>
          <Widget.Content>
            <form onSubmit={(e) => {
              e.preventDefault();
              router.push({ pathname: '/quiz', query: { name } });
            }}>
              <input type="text" placeholder="Digite seu nome"
                name="name" value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button type="submit" disabled={name.length === 0}>
                Jogar {name}
              </button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <h1>The legend of Zelda</h1>

            <p>csdgbhdfhgdv s sdg ds gsd gs...</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/aliffy-benevides" />
    </QuizBackground>
  );
}
