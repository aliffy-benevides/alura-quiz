import React from 'react';

import { questions, bg } from '../../db.json';

import QuizPage from '../../src/components/QuizPage';

function Quiz() {
  return (
    <QuizPage questions={questions} bg={bg} />
  );
}

export default Quiz;
