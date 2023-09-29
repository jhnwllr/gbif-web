import { z } from "zod";
import { DataMapper, ElasticSearchAssetSchema, ElasticSearchLinkSchema, parseElasticSearchAssetDTO, parseElasticSearchLinkDTO, createElasticSearchMapper, localized } from "./_shared";
import { News } from "../contentTypes/news";
import { pickLanguage } from "../languages";

export const elasticSearchNewsMapper: DataMapper<News> = createElasticSearchMapper({
    contentType: 'news',
    fields: z.object({
        id: z.string(),
        title: localized(z.string()),
        summary: localized(z.string()).optional(),
        body: localized(z.string()).optional(),
        primaryImage: ElasticSearchAssetSchema.optional(),
        primaryLink: ElasticSearchLinkSchema.optional(),
        secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
        citation: z.string().optional(),
        countriesOfCoverage: z.array(z.string()).optional(),
        topics: z.array(z.string()).optional(),
        purposes: z.array(z.string()).optional(),
        audiences: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean(),
        homepage: z.boolean(),
    }),
    map: (dto, language) => ({
        contentType: 'news',
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        primaryImage: dto.primaryImage == null ? undefined : parseElasticSearchAssetDTO(dto.primaryImage, language),
        primaryLink: dto.primaryLink == null ? undefined : parseElasticSearchLinkDTO(dto.primaryLink, language),
        secondaryLinks: dto.secondaryLinks?.map(l => parseElasticSearchLinkDTO(l, language)) ?? [],
        citation: dto.citation,
        countriesOfCoverage: dto.countriesOfCoverage ?? [],
        topics: dto.topics?.map(topic => ({
            contentType: 'topic',
            term: topic,
        })) ?? [],
        purposes: dto.purposes?.map(purpose => ({
            contentType: 'purpose',
            term: purpose,
        })) ?? [],
        audiences: dto.audiences?.map(audience => ({
            contentType: 'audience',
            term: audience,
        })) ?? [],
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        homepage: dto.homepage,
    })
})