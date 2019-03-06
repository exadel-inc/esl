const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const hbs = exphbs.create({
	layoutsDir: path.join(__dirname, '/layout/')
});

app.engine('.html', hbs.engine);

app.set('views', path.join(__dirname, '/pages/'));
app.set('view engine', 'html');

app.use(express.static('../lib'));
app.use(express.static('./static'));

app.use(require('./server-view')({
	viewPath: path.join(__dirname, '/pages/')
}));

app.listen(8081, function () {
	console.log(`Example app listening on port 8081!`);
});