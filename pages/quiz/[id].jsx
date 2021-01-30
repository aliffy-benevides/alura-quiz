import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import QuizPage from '../../src/components/QuizPage';

function ExternalQuiz({ externalDb }) {
  return (
    <ThemeProvider theme={externalDb.theme}>
      <QuizPage questions={externalDb.questions} bg={externalDb.bg} />
    </ThemeProvider>
  );
}

export function getServerSideProps(context) {
  return new Promise((resolve) => {
    fetch(`https://${context.query.id}.vercel.app/api/db`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }

        throw new Error('Falha em consultar os dados');
      })
      .then((externalDb) => resolve({
        props: {
          externalDb
        }
      }))
      .catch(() => {});
  });
}

ExternalQuiz.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  externalDb: PropTypes.any.isRequired
};

export default ExternalQuiz;
