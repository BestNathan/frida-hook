const frida = require('frida')
const fs = require('fs')

const scriptName = process.argv[2]
if (!scriptName) {
  console.error('script name must be specified!')
  process.exit(0)
}

async function main() {
  let scriptFile = `./injectScript/${scriptName}.js`

  let device = await frida.getUsbDevice()
  console.log(`[frida][USB device] id: ${device.id}, name: ${device.name}`)

  let app = await device.getFrontmostApplication()
  console.log(`[frida][frontApp] id: ${app.identifier}, name: ${app.name}, pid: ${app.pid}`)

  let session = await device.attach(app.pid)
  let source = fs.readFileSync(scriptFile).toString()

  let script = await session.createScript(source)

  script.events.listen('message', msg => {
    if (msg.type == 'error') {
      console.log('[script][error]', msg.description)
    } else if (msg.type == 'send') {
      console.log('[script][ msg ]', msg.payload)
    }
  })
  script.load()
}

main().catch(e => {
  console.log('[frida][error]', e.message)
  process.exit(0)
})
