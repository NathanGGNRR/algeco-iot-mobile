using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HeatingController : Controller {

        private readonly ICosmosDbService _cosmosDbService;
        public HeatingController(ICosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService;
        }

     

        [HttpGet("/byDevice")]
        [Authorize]
        public async Task<IActionResult> GetInformationByDevice(string deviceName)
        {
            QueryDefinition query = new QueryDefinition("SELECT c.DeviceId as DeviceId, MAX(c.date) as date FROM c where c.DeviceId = @deviceId GROUP BY c.DeviceId").WithParameter("@deviceId", deviceName); ;
            var results = await _cosmosDbService.GetMultipleDateTemperature(query);
            if (results.Count() > 0)
            {
                var result = results.First();
                string lastDate = $"{result.Date.Year}-{(result.Date.Month < 10 ? "0" + result.Date.Month : result.Date.Month)}-{(result.Date.Day < 10 ? "0" + result.Date.Day : result.Date.Day)}T{(result.Date.TimeOfDay.ToString().Contains("0000") ? result.Date.TimeOfDay.ToString().Replace("0000", "Z") : result.Date.TimeOfDay.ToString() + "+00:00")}";
                QueryDefinition resultQuery = new QueryDefinition("select * from c where c.DeviceId = @deviceId and c.date = @date").WithParameter("@deviceId", deviceName).WithParameter("@date", lastDate);
                var resultResults = await _cosmosDbService.GetMultipleDateTemperature(resultQuery);
                if (resultResults.Count() > 0)
                {
                    var finalResult = resultResults.First();

                    DateTime threeMonth = DateTime.Now.AddMonths(-3);
                    string threeMonthDate = $"{threeMonth.Date.Year}-{(threeMonth.Date.Month < 10 ? "0" + threeMonth.Date.Month : threeMonth.Date.Month)}-{(threeMonth.Date.Day < 10 ? "0" + threeMonth.Date.Day : threeMonth.Date.Day)}T{(threeMonth.Date.TimeOfDay.ToString().Contains("0000") ? threeMonth.Date.TimeOfDay.ToString().Replace("0000", "Z") : threeMonth.Date.TimeOfDay.ToString() + "+00:00")}";

                    QueryDefinition tempQuery = new QueryDefinition("select c.Temperature, c.date from c where c.DeviceId = @deviceId and c.date >= @date").WithParameter("@deviceId", deviceName).WithParameter("@date", threeMonthDate);
                    var resultsTemp = await _cosmosDbService.GetMultipleDateTemperature(tempQuery);
                    List<DataTemp> data = resultsTemp.Select(tempQuery => new DataTemp { Temperature = tempQuery.Temperature, Date = tempQuery.Date }).ToList<DataTemp>();

                    finalResult.Data = data;
                    return Ok(finalResult);
                }
                return BadRequest();
            }
            return BadRequest();
        }

        [HttpGet("/devices")]
        [Authorize]
        public async Task<IActionResult> GetDevices()
        {
            QueryDefinition query = new QueryDefinition("SELECT c.DeviceId as DeviceId, MAX(c.date) as date FROM c GROUP BY c.DeviceId");
            var results = await _cosmosDbService.GetMultipleDateTemperature(query);
            var listDevices = new List<DateTemperature>();
            foreach (var result in results)
            {
                var deviceName = result.DeviceId;
                string lastDate = $"{result.Date.Year}-{(result.Date.Month < 10 ? "0" + result.Date.Month : result.Date.Month)}-{(result.Date.Day < 10 ? "0" + result.Date.Day : result.Date.Day)}T{(result.Date.TimeOfDay.ToString().Contains("0000") ? result.Date.TimeOfDay.ToString().Replace("0000", "Z") : result.Date.TimeOfDay.ToString() + "+00:00" )}";
                QueryDefinition resultQuery = new QueryDefinition("select * from c where c.DeviceId = @deviceId and c.date = @date").WithParameter("@deviceId", deviceName).WithParameter("@date", lastDate);
                var resultResults = await _cosmosDbService.GetMultipleDateTemperature(resultQuery);
                if (resultResults.Count() > 0)
                {
                    listDevices.Add(resultResults.First());
                }
            }

            return Ok(listDevices);
        }

    }
}
