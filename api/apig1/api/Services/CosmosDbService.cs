namespace api.Services
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using api.Models;
    using Microsoft.Azure.Cosmos;
    using Microsoft.Azure.Cosmos.Fluent;
    using Microsoft.Extensions.Configuration;

    public class CosmosDbService : ICosmosDbService
    {
        private Container _container;
        public CosmosDbService(
            CosmosClient cosmosDbClient,
            string databaseName,
            string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }
        public async Task AddDateTemperature(DateTemperature dateTemperature)
        {
            await _container.CreateItemAsync(dateTemperature, new PartitionKey(dateTemperature.Id));
        }
        public async Task DeleteDateTemperature(string id)
        {
            await _container.DeleteItemAsync<DateTemperature>(id, new PartitionKey(id));
        }
        public async Task<DateTemperature> GetDateTemperature(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<DateTemperature>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException) //For handling item not found and other exceptions
            {
                return null;
            }
        }

        public async Task<IEnumerable<DateTemperature>> GetMultipleDateTemperature(QueryDefinition queryString)
        {
            var query = _container.GetItemQueryIterator<DateTemperature>(queryString);
            var results = new List<DateTemperature>();
            while (query.HasMoreResults)
            {
                var responseMoreResults = await query.ReadNextAsync();
                results.AddRange(responseMoreResults.ToList());
            }
            return results;
        }
        public async Task UpdateDateTemperature(string id, DateTemperature dt)
        {
            await _container.UpsertItemAsync(dt, new PartitionKey(id));
        }
    }
}
