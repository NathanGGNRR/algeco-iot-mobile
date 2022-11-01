using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace api.Models
{
    public class DateTemperature
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "DeviceId")]
        public string DeviceId { get; set; }

        [JsonProperty(PropertyName = "date")]
        public DateTime Date { get; set; }

        [JsonProperty(PropertyName = "Temperature")]
        public float Temperature { get; set; }

        [JsonProperty(PropertyName = "Humidity")]
        public float Humidity { get; set; }

        public List<DataTemp> Data { get; set; }

    }
}
