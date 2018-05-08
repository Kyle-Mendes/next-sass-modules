const fs = require('fs');

const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const dir = './src';

const application = next({ dev, dir });
const handle = application.getRequestHandler();

const appDir = './src/pages/apps';
const apps = {
	Public: '',
	Admin           : '/admin',
};

/**
 * getPages
 *
 * Gets all pages for a given application, recursively.
 * Finds all files that don't start with `__` and adds them
 * to an array of files that are available to be routed to.
 *
 * This array is then iterated over to expose the routes to express.
 *
 * @public
 * @param {string} path    The path to the directory to get the files from.
 * @param {string} prepend If the route is nested, we keep track of the path to prepend to the route
 *
 * @returns {Array<string>} All paths for the app.
 */
function getPages(path, prepend = '') {
	return fs
		.readdirSync(`${appDir}/${path}`)
		.reduce((acc, val) => {
			// If Directory, need to recursively go deeper.
			if (fs.lstatSync(`${appDir}/${path}/${val}`).isDirectory()) {
				const nestedPages = getPages(`${path}/${val}`, `${prepend}${val}/`);
				acc.push(...nestedPages);
			} else {
				const fileName = val.toLowerCase().split('.js')[0];
				acc.push(prepend.length ? `${prepend}${fileName}` : fileName);
			}

			return acc;
		}, []);
}

fs.readdir(appDir, (err, files) => {
	const pages = {};

	// Get all children of /pages/apps/<App>
	// This is the foundation of the applications that we build
	// to surface via next
	files.forEach(file => {
		if (fs.lstatSync(`${appDir}/${file}`).isDirectory()) {
			// read files to public pages
			pages[file] = getPages(file);
		}
	});

	application.prepare()
		.then(() => {
			const server = express();

			// populate all the pages into the Express Router
			console.log('REGISTERING ROUTES:');
			for (let app in pages) {
				const leading = apps[app];
				console.log(`\n${app} Routes:`);
				console.log('--------------------------------');
				pages[app].forEach((file) => {

					// If the file is 'index.js' we route the client
					// to '/' instead of '/index'
					const route = file.replace('index', '');
					let path = `/apps/${app}/${route}`;

					// Ensure no trailing '/'
					if (path.substr(-1) === '/') {
						path = path.substr(0, path.length - 1);
					}

					console.log(`\t ${leading}/${route} TO: ${path}`);

					server.get(`${leading}/${route}`, (req, res) => {
						// Render the file at the given location,
						// passing along request queries and params
						return application.render(
							req,
							res,
							path,
							{
								...req.query,
								...req.params,
							}
						);
					});
				});
			}

			server.get('/apps/*', (req, res) => { // Hide internal folder archetecture
				return application.render(req, res, '/404', req.query);
			});

			server.get('*', (req, res) => { // All other routes to be handled as usual
				return handle(req, res);
			});

			server.listen(port, (err) => {
				if (err) throw err;
				console.log(`\n\n> Ready on http://localhost:${port}`);
			});
		});
});

