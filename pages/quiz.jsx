import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { questions } from '../db.json';

import Widget from '../src/components/Widget';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';

const QuestionForm = styled.form`
  display: flex;
  flex-flow: column nowrap;

  button {
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

export default function Quiz() {
  const router = useRouter();
  const [number, setNumber] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setNumber(answers.length);
  }, [answers]);

  function renderAlternatives(question) {
    return question.alternatives.map((alternative, index) => {
      const isSelected = selectedAlternative === index;

      return (
        <button className="test" type="button" key={alternative}
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

  function renderQuestionForm() {
    const question = questions[number];

    return (
      <QuestionForm onSubmit={(e) => {
        e.preventDefault();

        setSelectedAlternative(null);
        setAnswers([...answers, selectedAlternative]);
      }}>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <AlternativesContainer>
          {renderAlternatives(question)}
        </AlternativesContainer>
        <button type="submit" disabled={selectedAlternative === null}>
          CONFIRMAR
        </button>
      </QuestionForm>
    );
  }

  function renderEnd() {
    const correctAnswers = questions.filter((question, i) => question.answer === answers[i]).length;

    return (
      <h3>Você acertou {correctAnswers} de {questions.length} perguntas</h3>
    );
  }

  return (
    <QuizBackground>
      <QuizContainer>
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
            {
              answers.length < questions.length
                ? <h1>Pergunta {number + 1} de {questions.length}</h1>
                : <h1>Parabéns {router.query.name}</h1>
            }
          </Widget.Header>
          {answers.length < questions.length && (
            <img src={questions[number].image} alt="Question"
              style={{ width: '100%' }}
            />
          )}
          <Widget.Content>
            {answers.length < questions.length ? renderQuestionForm() : renderEnd()}
          </Widget.Content>
        </Widget>
      </QuizContainer>
    </QuizBackground>
  );
}
