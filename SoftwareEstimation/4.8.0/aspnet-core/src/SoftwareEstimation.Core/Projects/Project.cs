using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SoftwareEstimation.Projects
{
    [Table("AppProjects")]
    public class Project : FullAuditedEntity<Guid>
    {
        public virtual long UserID { get; set; }
        public virtual string Title { get; protected set; }
        public virtual string Description { get; protected set; }
        public virtual string Type { get; protected set; }
        public virtual string LinkURL { get; protected set; }

        public const int MaxTitleLength = 100;
        public const int MaxDescriptionLength = 2000;
        protected Project()
        {

        }

        public static Project CreateWithLink (long userid, string title, string description, string type, string linkURL)
        {
            var @project = new Project
            {
                UserID = userid,
                Title = title,
                Description = description,
                Type = type,
                LinkURL = linkURL

            };

            return @project;
        }



    }
}
