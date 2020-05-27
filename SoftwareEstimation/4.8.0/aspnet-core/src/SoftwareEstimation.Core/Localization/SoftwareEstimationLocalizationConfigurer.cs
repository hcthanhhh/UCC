using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace SoftwareEstimation.Localization
{
    public static class SoftwareEstimationLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(SoftwareEstimationConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(SoftwareEstimationLocalizationConfigurer).GetAssembly(),
                        "SoftwareEstimation.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
