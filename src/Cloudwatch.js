let AWS = require('aws-sdk')
let Table = require('cli-table')
const { ConnectLogs, setFileName, initOptions, addLogger } = require('./middleware/logger/winston')

//mandatory
//1.Set the region since we are running this code from your desktop using node:
AWS.config.update({region: 'us-east-1'})
//2.Set the API version for cloudwatchlogs:
AWS.config.apiVersions = {
    cloudwatchlogs: '2014-03-28',
}
let cloudwatchlogs = new AWS.CloudWatchLogs()

class Cloudwatch {
    constructor({connectInstanceName, ANI, date, contactID}){
        this.connectInstanceName = connectInstanceName,
        this.ANI = ANI,
        this.date = date,
        this.contactID = contactID
        this.params
    }
    // Get contact ID method:
    async getContactIds(){
        // Form the params for the cloudwatch filterLogEvents API:
        this.params={
            logGroupName: `/aws/connect/${this.connectInstanceName}`, /* required */
            filterPattern: `{($.ContactFlowModuleType=SetAttributes) && ($.Parameters.Key=ANI) && ($.Parameters.Value=${this.ANI})}`,
            interleaved: true,
            limit: 100,
            logStreamNamePrefix: this.date
        }
        //create an object for class Table(imported from library table-cli)
        let table = new Table({
            head: ['Timestamp', 'ContactID', 'ANI'], 
            colWidths: [50, 50, 50]
        })
        try{
            //Invoke cloudwatch filterLogEvents API:
            const data = await cloudwatchlogs.filterLogEvents(this.params).promise()
            data.events.forEach(item =>{
                //Push it to the table object
                table.push(
                    [JSON.parse(item.message).Timestamp, JSON.parse(item.message).ContactId, this.ANI]
                )
            })
            //print it as table:
            console.log(table.toString())
        }catch(e){
            console.log(e.message)
        }
    }

    //Get cloudwatch logs method:
    async getLogs(){
        // Form the params for the cloudwatch filterLogEvents API:
        this.params = {
            logGroupName: `/aws/connect/${this.connectInstanceName}`, /* required */
            filterPattern: `{$.ContactId=${this.contactID}}`,
            interleaved: true,
            limit: 100
          }
          try{
            const data = await cloudwatchlogs.filterLogEvents(this.params).promise()
            setFileName(`${this.contactID}`) /* Set the name of the log file using setFileName method imported from  ../middleware/logger/winston */
            initOptions() /* Initialize winston options using initOptions method imported from  ../middleware/logger/winston */
            addLogger() /* Add logger addLogger method imported from  ../middleware/logger/winston */
            // Check if there are log streams for the contactId
            data.events.length > 0 ? (
                data.events.forEach(item => ConnectLogs().info(item)),
                console.log(`Logs have been uploaded, please check ./logs/${this.contactID}.log`)
            ) : console.log(`No logs found for contactID: ${this.contactID}`) /* No log streams found for that particular contact ID*/
          }catch(e){
              // If error getting the logs from  cloudwatch
            console.log('Error getting logs from cloudwatch: ', e.stack)
          }
    }
}

module.exports = Cloudwatch