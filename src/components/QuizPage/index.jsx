import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components';
import { useRouter } from 'next/router';
import { ClockLoader } from 'react-spinners';

import QuizBackground from '../QuizBackground';
import QuizContainer from '../QuizContainer';
import QuizLogo from '../QuizLogo';
import Widget from '../Widget';
import Button from '../Button';
import BackArrow from '../BackArrow';

const QuestionFormStyles = styled.form`
  display: flex;
  flex-flow: column nowrap;

  button[type=submit] {
    margin-top: 20px;
    text-align: center;
  }
`;

const AlternativesContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;

  button {
    cursor: pointer;
  }

  a[data-selected="true"] {
    background-color: ${({ theme }) => theme.colors.primary};
    
    &[data-status="SUCCESS"] {
      background-color: ${({ theme }) => theme.colors.success};
    }
    &[data-status="ERROR"] {
      background-color: ${({ theme }) => theme.colors.wrong};
    }
  }

  a:focus {
    opacity: 1;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

function QuizPage({ questions, bg }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    const timerId = setTimeout(() => setIsLoading(false), 3000);

    return (() => {
      clearTimeout(timerId);
    });
  }, []);

  useEffect(() => {
    setQuestionIndex(answers.length);
  }, [answers]);

  function LoadingWidget() {
    return (
      <Widget>
        <Widget.Header>
          Carregando...
        </Widget.Header>
  
        <Widget.Content>
          <LoaderContainer>
            <ClockLoader size={150} color={themeContext.colors.secondary} />
          </LoaderContainer>
        </Widget.Content>
      </Widget>
    );
  }

  function renderAlternatives(question) {
    return question.alternatives.map((alternative, index) => {
      const alternativeId = `alternative_${index}`;
      const isSelected = selectedAlternative === index;

      return (
        <Widget.Topic key={alternativeId}
          data-selected={isSelected}
          data-status={isQuestionAnswered && ((selectedAlternative === question.answer) ? 'SUCCESS' : 'ERROR')}
          onClick={() => {
            if (!isQuestionAnswered) {
              if (!isSelected) {
                setSelectedAlternative(index);
              } else {
                setSelectedAlternative(null);
              }
            }
          }}
        >
          {alternative}
        </Widget.Topic>
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
        }, 1500);
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
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />

        {isLoading ? <LoadingWidget /> : (
          <Widget>
            <Widget.Header>
              <div aria-hidden="true"
                style={{ marginRight: '10px' }}
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
              >
                <BackArrow />
              </div>
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

QuizPage.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    answer: PropTypes.number.isRequired,
    alternatives: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
  bg: PropTypes.string.isRequired
};

export default QuizPage;
