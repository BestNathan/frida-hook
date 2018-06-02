const frida = require('frida')
const fs = require('fs')

const config = {
  showFront: true,
  showProcess: 0
}

let topPid = null
let script = './injectScript/hash.js'

const app = device => {
  device
    .attach(topPid)
    .then(session => {
      let source = fs.readFileSync(script).toString()
      session
        .createScript(source)
        .then(script => {
          script.events.listen('message', msg => {
            if (msg.type == 'error') {
              console.log('[error]', msg.description)
            } else if (msg.type == 'send') {
              console.log('[msg]', msg.payload)
            }
          })
          script.load()
        })
        .catch(e => {
          console.log(e.message)
          process.exit(0)
        })
    })
    .then(() => {
      //process.exit(0)
    })
    .catch(e => {
      console.log(e.message)
      process.exit(0)
    })
}

frida
  .getUsbDevice()
  .then(device => {
    console.log(`[USB device]id: ${device.id}, name: ${device.name}`)
    return device.id
  })
  .then(id => {
    if (!id) {
      console.log('no device')
      process.exit(0)
    }
    return frida.getDevice(id)
  })
  .then(device => {
    if (config.showFront) {
      return device.getFrontmostApplication().then(app => {
        console.log(`[frontApp] id: ${app.identifier}, name: ${app.name}, pid: ${app.pid}`)
        topPid = app.pid
        return device
      })
    }
    return device
  })
  .then(device => {
    if (config.showProcess) {
      return device.enumerateProcesses().then(ps => {
        ps.forEach(p => {
          console.log(`[process] pid: ${p.pid}, name: ${p.name}`)
        })
        return device
      })
    }
    return device
  })
  .then(app)
  .catch(e => {
    console.log(e.message)
    process.exit(0)
  })
