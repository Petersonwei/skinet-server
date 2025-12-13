using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("unauthorized")]
    public ActionResult GetUnauthorized()
    {
        return Unauthorized();
    }

    [HttpGet("notfound")]
    public ActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("servererror")]
    public ActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }

    [HttpGet("badrequest")]
    public ActionResult GetBadRequest()
    {
        return BadRequest("This is a bad request");
    }

    [HttpGet("internalerror")]
    public ActionResult GetInternalError()
    {
        throw new Exception("This is a test exception");
    }

    [HttpGet("validationerror")]
    public ActionResult GetValidationError(CreateProductDto product)
    {
        return Ok();
    }

    [HttpGet("secrets")]
    [Authorize]
    public IActionResult GetSecrets()
    {
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return Ok($"Hello {name} with the id of {id}");
    }
}
