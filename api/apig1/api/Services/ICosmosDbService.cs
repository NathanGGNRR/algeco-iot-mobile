namespace api.Services
{
    using api.Models;
    using Microsoft.Azure.Cosmos;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface ICosmosDbService
    {
        Task<IEnumerable<DateTemperature>> GetMultipleDateTemperature(QueryDefinition queryString);
        Task<DateTemperature> GetDateTemperature(string id);
        Task AddDateTemperature(DateTemperature dt);
        Task UpdateDateTemperature(string id, DateTemperature dt);
        Task DeleteDateTemperature(string id);
    }
}
