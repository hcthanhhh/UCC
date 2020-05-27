using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SoftwareEstimation.Projects.Dto
{
    public class ProjectInput
    {
        [Required]
        [StringLength(Project.MaxTitleLength)]
        public string Title { get; set; }

        [StringLength(Project.MaxDescriptionLength)]
        public string Description { get; set; }

        public string Type { get; set; }

        public string LinkURL { get; set; }
    }
}
