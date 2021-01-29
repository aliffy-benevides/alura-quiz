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

  button[data-selected="true"] {
    background-color: ${({ theme }) => theme.colors.primary};
    
    &[data-status="SUCCESS"] {
      background-color: ${({ theme }) => theme.colors.success};
    }
    &[data-status="ERROR"] {
      background-color: ${({ theme }) => theme.colors.wrong};
    }
  }

  button:focus {
    opacity: 1;
  }
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
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);

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
      const alternativeId = `alternative_${index}`;
      const isSelected = selectedAlternative === index;

      return (
        <button className="alternative-button" type="button" key={alternativeId}
          data-selected={isSelected}
          data-status={isQuestionAnswered && ((selectedAlternative === question.answer) ? 'SUCCESS' : 'ERROR')}
          onClick={() => (!isSelected
            ? setSelectedAlternative(index)
            : setSelectedAlternative(null))}
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

        setIsQuestionAnswered(true);

        setTimeout(() => {
          setIsQuestionAnswered(false);
          setSelectedAlternative(null);
          setAnswers([...answers, selectedAlternative]);
        }, 3000);
      }}>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <AlternativesContainer>
          {renderAlternatives(question)}
        </AlternativesContainer>
        <Button type="submit" disabled={isQuestionAnswered || selectedAlternative === null}>
          CONFIRMAR
        </Button>
        {isQuestionAnswered && (selectedAlternative === question.answer
          ? <p>Acertou!</p>
          : (
            <p>
              Errroooouu!<br />A resposta certa é:<br />
              {question.alternatives[question.answer]}
            </p>
          ))}
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
                style={{ marginRight: '10px' }}
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
