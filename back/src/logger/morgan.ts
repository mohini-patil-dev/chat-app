import morgan from 'morgan';

const DASH_REPEAT = 10;

export default morgan(
    `${'-'.repeat(
        DASH_REPEAT,
    )} :method, :url, Status -> :status, :response-time ms ${'-'.repeat(
        DASH_REPEAT,
    )}`,
    {
        skip: (req, res) => req.method === 'OPTIONS',
    },
);
