const axios = require('axios');
const express = require('express');
const server = express();
const PORT = process.env.PORT || 3300;

server.use(express.static('public'));

server.get('/', (_req, res) => {
    var body = {
        'status': 'OK Preview',
        'request': {
            'headers': _req.headers
        }
    }
    res.writeHead(200, {
        'Content-Type': 'application/json',
        // 'Strict-Transport-Security': 'max-age=315',
        // 'Content-Security-Policy': 'null',
        // 'X-Content-Type-Options': 'null',
        // 'X-Frame-Options': 'null',
        // 'X-XSS-Protection': 'null'
    });
    res.end(JSON.stringify(body, null, 4));
});

server.get('/fetch-wordpress-graphql', async (_req, res) => {
  const query = `
    query QueryPosts {
      posts {
        nodes {
          id
          content
          title
          slug
          featuredImage {
            node {
              mediaDetails {
                sizes {
                  sourceUrl
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(process.env.GRAPHQL_API_URL, { query });
  res.send(response.data.data.posts.nodes);
});

server.get('/envs', (req, res) => {
  console.log(process.env);
  res.send('Envs displayed in logs!');
});

server.listen(PORT, () => {
  console.log(`Application is listening at port ${PORT}`);
});
