using System.ComponentModel.DataAnnotations;

namespace SoftwareEstimation.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}