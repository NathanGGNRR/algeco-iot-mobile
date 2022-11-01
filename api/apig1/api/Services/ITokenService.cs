using api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services
{
    public interface ITokenService
    {
        string BuildToken(string key, LoginModel user);
    }
}
