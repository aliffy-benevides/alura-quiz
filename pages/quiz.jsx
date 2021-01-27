import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { questions } from '../db.json';

import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Widget from '../src/components/Widget';
import Button from '../src/components/Button';

const QuestionFormStyles = styled.form`
  display: flex;
  flex-flow: column nowrap;

  .alternative-button {
    margin-top: 5px;
    text-align: left;
    padding: 7px;
    border-radius: 7px;
    outline: none;
  }

  button[type=submit] {
    margin-top: 20px;
    text-align: center;
  }
`;

const AlternativesContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}

export default function Quiz() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const timerId = setTimeout(() => setIsLoading(false), 1000);

    return (() => {
      clearTimeout(timerId);
    });
  }, []);

  useEffect(() => {
    setQuestionIndex(answers.length);
  }, [answers]);

  function renderAlternatives(question) {
    return question.alternatives.map((alternative, index) => {
      const isSelected = selectedAlternative === index;
      const alternativeId = `alternative_${index}`;

      return (
        <button className="alternative-button" type="button" key={alternativeId}
          style={{ backgroundColor: isSelected ? 'green' : 'gray' }}
          onClick={() => {
            if (!isSelected) {
              setSelectedAlternative(index);
            } else {
              setSelectedAlternative(null);
            }
          }}
        >
          {alternative}
        </button>
      );
    });
  }

  function QuestionForm() {
    const question = questions[questionIndex];

    return (
      <QuestionFormStyles onSubmit={(e) => {
        e.preventDefault();

        if (selectedAlternative === question.answer) {
          // eslint-disable-next-line no-alert
          alert('Acertou!');
        } else {
          // eslint-disable-next-line no-alert
          alert(`Errroooouu!\nA resposta certa é:\n${question.alternatives[question.answer]}`);
        }

        setSelectedAlternative(null);
        setAnswers([...answers, selectedAlternative]);
      }}>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <AlternativesContainer>
          {renderAlternatives(question)}
        </AlternativesContainer>
        <Button type="submit" disabled={selectedAlternative === null}>
          CONFIRMAR
        </Button>
      </QuestionFormStyles>
    );
  }

  function QuizEnd() {
    const correctAnswers = questions.filter((question, i) => question.answer === answers[i]).length;

    return (
      <h3>Você acertou {correctAnswers} de {questions.length} perguntas</h3>
    );
  }

  return (
    <QuizBackground>
      <QuizContainer>
        <QuizLogo />

        {isLoading ? <LoadingWidget /> : (
          <Widget>
            <Widget.Header>
              <button type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
              >
                {'<'}
              </button>
              {answers.length < questions.length
                ? <h1>Pergunta {questionIndex + 1} de {questions.length}</h1>
                : <h1>Parabéns {router.query.name}</h1>}
            </Widget.Header>
            {answers.length < questions.length && (
              <img src={questions[questionIndex].image} alt="Descrição"
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                }}
              />
            )}
            <Widget.Content>
              {answers.length < questions.length ? <QuestionForm /> : <QuizEnd />}
            </Widget.Content>
          </Widget>
        )}
      </QuizContainer>
    </QuizBackground>
  );
}
