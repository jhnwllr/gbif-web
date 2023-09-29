import { z } from "zod";
import { Project } from "../contentTypes/project";
import { DataMapper, ElasticSearchAssetSchema, ElasticSearchLinkSchema, PartnerSchema, createElasticSearchMapper, localized, parseElasticSearchAssetDTO, parseElasticSearchPartnerDTO } from "./_shared";
import { DateAsStringSchema } from "../utils";
import { pickLanguage } from "../languages";


export const elasticSearchProjectMapper: DataMapper<Project> = createElasticSearchMapper({
    contentType: 'project',
    fields: z.object({
        id: z.string(),
        title: localized(z.string()),
        summary: localized(z.string()).optional(),
        body: localized(z.string()).optional(),
        primaryImage: ElasticSearchAssetSchema.optional(),
        primaryLink: ElasticSearchLinkSchema.optional(),
        secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
        officialTitle: z.string().optional(),
        projectId: z.string().optional(),
        status: z.string(),
        grantType: z.string().optional(),
        start: DateAsStringSchema.optional(),
        end: DateAsStringSchema.optional(),
        fundsAllocated: z.number().int().optional(),
        matchingFunds: z.number().int().optional(),
        // TODO: This must be of type programme, which is not defined yet
        programme: z.unknown(),
        // TODO: Inspect the call type to see if i have missed any fields
        call: z.object({
            id: z.string(),
            title: localized(z.string()),
        }).optional(),
        documents: z.array(ElasticSearchAssetSchema).optional(),
        // TODO: List of Participant and/or Organisation
        fundingOrganisations: z.unknown().optional(),
        // TODO: List of News
        news: z.unknown().optional(),
        // TODO: List of Event
        events: z.unknown().optional(),
        // TODO: Participant or Organisation
        leadPartner: PartnerSchema.optional(),
        // TODO: List of Participant or Organisation
        additionalPartners: z.array(PartnerSchema).optional(),
        leadContact: z.string().optional(),
        purposes: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean(),
        homepage: z.boolean(),
        // TODO: This is a Country link. It is maybe converted to a single string in elastic search
        contractCountry: z.string(),
        // TODO: Optional Organisation
        overrideProgrammeFunding: z.unknown().optional(),

        // Fields that are comming directly from ElasticSearch
        gbifRegion: z.string(),
        createdAt: DateAsStringSchema,
        gbifProgrammeAcronym: z.string(),
    }),
    map: (dto, language) => ({
        contentType: 'project',
        id: dto.id,
        leadPartner: dto.leadPartner == null ? undefined : parseElasticSearchPartnerDTO(dto.leadPartner, language),
        title: pickLanguage(dto.title, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        gbifRegion: dto.gbifRegion,
        createdAt: dto.createdAt,
        end: dto.end,
        matchingFunds: dto.matchingFunds,
        programme: dto.programme,
        primaryImage: dto.primaryImage == null ? undefined : parseElasticSearchAssetDTO(dto.primaryImage),
        start: dto.start,
        fundsAllocated: dto.fundsAllocated,
        officialTtitle: dto.officialTitle,
        leadContact: dto.leadContact,
        searchable: dto.searchable,
        contractCountry: dto.contractCountry,
        call: dto.call == null ? undefined : {
            id: dto.call.id,
            title: pickLanguage(dto.call.title, language),
        },
        gbifProgrammeAcronym: dto.gbifProgrammeAcronym,
        projectId: dto.projectId,
        additionalPartners: dto.additionalPartners?.map(p => parseElasticSearchPartnerDTO(p, language)) ?? [],
        status: dto.status,
        homepage: dto.homepage,
        documents: dto.documents == null ? [] : dto.documents.map(l => parseElasticSearchAssetDTO(l, language)),
        // eventIds: dto.events?.map(e => e.id) ?? [],
        keywords: dto.keywords ?? [],
    }),
})