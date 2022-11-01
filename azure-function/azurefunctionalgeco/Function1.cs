using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Azure.EventHubs;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace azurefunctionalgeco
{
    public static class Telemetries
    {
        [FunctionName("Telemetries")]
        public static void Run(
            [EventHubTrigger("iothub-ehub-iothubdiia-17060170-a569f35d4d",
            Connection = "EventHubConnectionString")] EventData message, 
            [CosmosDB(
                databaseName: "MyDb",
                collectionName: "DateTemperatures",
                ConnectionStringSetting = "MongoDbConnectionString")]out dynamic document
            , ILogger log)
        {
            var messageDecoded = Encoding.UTF8.GetString(message.Body.ToArray());
            var messageId = messageDecoded.Substring(messageDecoded.IndexOf("messageId")+13, messageDecoded.IndexOf(',') - (messageDecoded.IndexOf("messageId") + 13));
            var deviceId = messageDecoded.Substring(messageDecoded.IndexOf("deviceId") + 11, (messageDecoded.IndexOf("temperature") - 5) -( messageDecoded.IndexOf("deviceId") + 9));
            var temperature = messageDecoded.Substring(messageDecoded.IndexOf("temperature") + 14, (messageDecoded.IndexOf("humidity") - 3) - (messageDecoded.IndexOf("temperature") + 14));
            var humidity = messageDecoded.Substring(messageDecoded.IndexOf("humidity") + 10, messageDecoded.LastIndexOf('}') - (messageDecoded.IndexOf("humidity") + 10));
            document = new { MessageId = messageId, DeviceId = deviceId, Temperature = temperature, Humidity = humidity, date = DateTime.Now, id = Guid.NewGuid() };

            log.LogInformation($"C# IoT Hub trigger function processed a message: {Encoding.UTF8.GetString(message.Body.ToArray())}");
        }
    }
}