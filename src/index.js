const Cloudwatch = require ('./Cloudwatch')
require('yargs')
                .command(['get-id', '--name', '--ani'], 'command to get the contactIDs', () => {}, (argv) => {
                    //full command:
                    /* node ./index.js getID --name='<connect-instance-name>' --ani='+14792680365' --date='2019/09/25' */
                    /* instanceName = '<connect-instance-name>' */
                    /* ANI = '+14792680365' */ 
                    /* date = '2019/09/25' */
                    const connectInstanceName = argv.name /* node index.js -name='<connect-instance-name>' */ 
                    const ANI = argv.ani /* node index.js -ani='+!4792680365' */
                    const date = argv.date /* node index.js -date='2019/09/25' */
                    console.log(`Get the contactIDs for connect instance: ${connectInstanceName} with customer contact number: ${ANI} for date: ${date}`)
                    //Create an object for Cloudwatch class:
                    const cloudwatch = new Cloudwatch({connectInstanceName, ANI, date})
                    //Invoke getContatIds method in Cloudwatch:
                    cloudwatch.getContactIds()
                })
                .command(['get-log', '--name', '--id'], 'command to get amazon connect logs', () => {}, (argv) =>{
                    //full command:
                    /* node ./index.js get-log --name='<connect-instance-name>' --id='9c7ff421-bcec-4ee7-a2e7-c8a2a870fb1e' */
                    /* instanceName = '<connect-instance-name>' */
                    /* contactID = '9c7ff421-bcec-4ee7-a2e7-c8a2a870fb1e' */ 
                    const connectInstanceName = argv.name /* node index.js -name='<connect-instance-name>' */
                    const contactID = argv.id 
                    console.log(`Get the logs for connect instance: ${connectInstanceName} with contactID: ${contactID}`)
                    const cloudwatch = new Cloudwatch({connectInstanceName, contactID})
                    //Invoke getLogs method in Cloudwatch:
                    cloudwatch.getLogs()
                })
                .demandCommand()
                .help()
                .wrap(72)
                .argv