import * as express from 'express';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import staticFiles from './routes/static-files';
import dynamic from './routes/dynamic';
import api from './routes/api';

const app = express();

app.use(compression());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api', api);
app.use('/assets', staticFiles);
app.use('/', dynamic);

app.listen(8080, () => {
    console.log(`Redirect listening on port 8080`);
    console.log('Press Ctrl+C to quit.');
  });