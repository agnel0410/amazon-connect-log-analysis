var appRoot = require('app-root-path')
var winston = require('winston')
const { format } = winston
const { combine, label, json, timestamp, prettyPrint, printf } = format

let file
let options

const setFileName = (name) =>{
    file = name
}


const myFormat = printf(info => {
    return `${JSON.parse(info.message).Timestamp} [${JSON.parse(info.message).ContactFlowModuleType}]: ${JSON.stringify(JSON.parse(info.message), null, 4)}`;
  });

  const initOptions = ()=>{
    options = {
        file: {
          level: 'silly',
          filename: `${appRoot.path}/logs/${file}.log`,
          handleExceptions: true,
        //   format: winston.format.json(),
          json: true,
          maxsize: '5MB', // 5MB
          maxFiles: 10,
          colorize: true,
        }
      }
  }

  const addLogger = () =>{
    winston.loggers.add('ConnectLogs', {
        format: combine(
          myFormat //define how you want to print on console or file
        ),
        transports: [
        //   new winston.transports.Console(options.console),
          new winston.transports.File(options.file)
        ],
        exitOnError: false, // do not exit on handled exceptions
      })
  }
  
  const ConnectLogs = () => winston.loggers.get('ConnectLogs')

  
module.exports = { ConnectLogs, setFileName, initOptions, addLogger, addLogger }