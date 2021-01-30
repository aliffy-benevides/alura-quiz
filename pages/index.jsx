import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

import {
  bg, title, description, external
} from '../db.json';

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
        <Widget
          as={motion.section}
          transition={{ delay: 0, duration: 0.5 }}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' }
          }}
          initial="hidden" animate="show"
        >
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

        <Widget
          as={motion.section}
          transition={{ delay: 0.5, duration: 0.5 }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 }
          }}
          initial="hidden" animate="show"
        >
          <Widget.Content>
            <h1>Quizes da galera</h1>

            <ul>
              {external.map((link) => {
                const [projectName, userName] = /https?:\/\/([\w.-]+).vercel.app\/?/.exec(link)[1]
                  .split('.');
                return (
                  <li key={link}>
                    <Link passHref href={({
                      pathname: `/quiz/${projectName}.${userName}`,
                      query: { name }
                    })}>
                      <Widget.Topic disabled={name.length === 0}>
                        {`${projectName} - ${userName}`}
                      </Widget.Topic>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/aliffy-benevides" />
    </QuizBackground>
  );
}
