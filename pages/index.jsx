import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { bg, title, description } from '../db.json';

import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>{title}</h1>
          </Widget.Header>
          <Widget.Content>
            <p>{description}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              router.push({ pathname: '/quiz', query: { name } });
            }}>
              <Input type="text" placeholder="Digite seu nome"
                name="name" value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Button type="submit" disabled={name.length === 0}>
                Jogar {name}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <h1>Quizes da galera</h1>

            <p>csdgbhdfhgdv s sdg ds gsd gs...</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/aliffy-benevides" />
    </QuizBackground>
  );
}
