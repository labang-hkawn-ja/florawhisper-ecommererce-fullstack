
export type FlowerLanguageDto = {
    id?: number,
    name?: string,
    scientificName?: string,
    meaning?: string,
    symbolism?: string,
    description?: string,
    plantingGuide?: string,
    careInstructions?: string,
    season?: string,
    occasions?: string[],
    culturalMeanings?: string[],
    imageUrls?: string[],
    bloomingPeriod?: string,
    colorVarieties?: string,
    colorMeanings?: Map<string, string>,
    originCountry?: string,
    isPerennial?: boolean
}