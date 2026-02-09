using Microsoft.Extensions.Configuration;
using InsuranceConsultingReport.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace InsuranceConsultingReport.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public HomeController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.ApiBaseUrl = _configuration["Api:BaseUrl"];
            return View(new QuerySearchViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(QuerySearchViewModel vm)
        {
            ViewBag.ApiBaseUrl = _configuration["Api:BaseUrl"];
            vm.ErrorMessage = null;
            vm.Client = null;
            vm.Insurance = null;
            vm.Clients = new();
            vm.Insurances = new();

            if (string.IsNullOrWhiteSpace(vm.Value))
            {
                vm.ErrorMessage = "Please enter a value.";
                return View(vm);
            }

            var client = _httpClientFactory.CreateClient("InsuranceApi");
            var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            try
            {
                if (vm.SearchType == "identification")
                {
                    var url = $"/api/queries/by-client/{Uri.EscapeDataString(vm.Value.Trim())}";
                    var res = await client.GetAsync(url);

                    if (!res.IsSuccessStatusCode)
                    {
                        vm.ErrorMessage = res.StatusCode == System.Net.HttpStatusCode.NotFound
                            ? "Client not found."
                            : "Error calling API.";
                        return View(vm);
                    }

                    var body = await res.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(body);

                    vm.Client = JsonSerializer.Deserialize<ClientInfo>(
                        doc.RootElement.GetProperty("client").GetRawText(), jsonOptions);

                    vm.Insurances = JsonSerializer.Deserialize<List<InsuranceItem>>(
                        doc.RootElement.GetProperty("insurances").GetRawText(), jsonOptions) ?? new();
                }
                else
                {
                    var url = $"/api/queries/by-insurance/{Uri.EscapeDataString(vm.Value.Trim())}";
                    var res = await client.GetAsync(url);

                    if (!res.IsSuccessStatusCode)
                    {
                        vm.ErrorMessage = res.StatusCode == System.Net.HttpStatusCode.NotFound
                            ? "Insurance not found."
                            : "Error calling API.";
                        return View(vm);
                    }

                    var body = await res.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(body);

                    vm.Insurance = JsonSerializer.Deserialize<InsuranceInfo>(
                        doc.RootElement.GetProperty("insurance").GetRawText(), jsonOptions);

                    vm.Clients = JsonSerializer.Deserialize<List<ClientItem>>(
                        doc.RootElement.GetProperty("clients").GetRawText(), jsonOptions) ?? new();
                }
            }
            catch
            {
                vm.ErrorMessage = "Unexpected error calling API.";
            }

            return View(vm);
        }
    }
}
