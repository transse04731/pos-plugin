const path = require('path')
const fs = require('fs')

module.exports = cms => {
  cms.socket.on('connect', socket => {
    socket.on('get-app-version', callback => {
      const packagePath = path.join(__dirname, '/../../package.json')
      if (fs.existsSync(packagePath)) {
        const pkgRaw = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
        version = pkgRaw.version
        if (!version) return

      }
      callback(version)
    })
  })
}