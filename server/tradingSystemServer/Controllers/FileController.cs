
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;
namespace tradingSystemServer.Controllers


{
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        [Obsolete]
        public static IHostingEnvironment? _environment;

        [Obsolete]
        public FileController(IHostingEnvironment environment)
        {
            _environment = environment;
        }

        //this route uploads a file (typically an image) to the server and returns its url so it can be used elsewhere
        //in the client side for example
        [HttpPost("UploadFile")]
        public async Task<OkObjectResult> UploadFile([FromForm] IFormFile file)
        {
            string path = Path.Combine(_environment.ContentRootPath, "Images/" + file.FileName);
            using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            return new OkObjectResult(new { message = "Uploaded Successfully", file = $"http://localhost:4200/api/file/GetImage/{file.FileName}"}); 
        }

        //this route gets a file (typically an image) given its name in the url parameter from
        // the server 
        [HttpGet("GetImage/{imageName}")]
        public IActionResult GetImage(string imageName)
        {
            try
            {
                string imagePath = Path.Combine(_environment.ContentRootPath, "Images", imageName);

                if (!System.IO.File.Exists(imagePath))
                    return NotFound();

                var imageFileStream = new FileStream(imagePath, FileMode.Open, FileAccess.Read);
                return File(imageFileStream, "image/jpeg"); // Adjust the MIME type based on your image type
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }

   
}