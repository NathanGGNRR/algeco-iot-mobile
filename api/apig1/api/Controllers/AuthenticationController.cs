using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace api.Controllers
{
    public class AuthenticationController
    {

        private readonly IConfiguration _config;
        private readonly ITokenService _tokenService;
        private string generatedToken = null;

        public AuthenticationController(IConfiguration config, ITokenService tokenService)
        {
            _config = config;
            _tokenService = tokenService;
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                return new UnauthorizedResult();
            }

            if (model.Username == _config["Jwt:Username"] && BCrypt.Net.BCrypt.Verify(model.Password, _config["Jwt:Password"]))
            {
                generatedToken = _tokenService.BuildToken(_config["Jwt:Key"].ToString(), model);
                if (generatedToken != null)
                {
                    return new OkObjectResult(generatedToken);
                }
                else
                {
                    return new UnauthorizedResult();
                }
            }
            else
            {
                return new UnauthorizedResult();
            }
        }
    }
}
