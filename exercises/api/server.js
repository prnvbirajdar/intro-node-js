const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const mime = require('mime');

const findAsset = (name) => {
  const assetPath = path.join(__dirname, 'assets', name)
  return new Promise((resolve, reject)=>{
    fs.readFile(assetPath, {encoding: 'utf-8'},(error, result) => {
      if(error){
        reject(error)
      } else{
        resolve(result)
      }
    })
  })
}

const hostname = '127.0.0.1'
const port = 3000

const router = {
  '/ GET':{
    asset: 'index.html',
    mime: mime.getType('html')
  },
  '/style.css GET':{
    asset: 'style.css',
    mime: mime.getType('css')
  }
}

// log incoming request coming into the server. Helpful for debugging and tracking
const logRequest = (method, route, status) => console.log(method, route, status)

const server = http.createServer(async (req, res) => {
  const method = req.method
  const route = url.parse(req.url).pathname
  // check the router for the incomming route + method pair
  const routeMatch = router[`${route} ${method}`]
  // return not found if the router does not have a match
  if (!routeMatch) {
    res.writeHead(404)
    logRequest(method, route, 404)
    res.end()
    return
  }

  res.writeHead(200, {'Content-Type': match.mime})
  res.write(await findAsset(match.asset))
  logRequest(method, route, 200)
  res.end()

})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
